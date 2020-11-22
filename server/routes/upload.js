const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path')

const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

// default options
//middleware
//al llamar fileUpload todo cae en req.files
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(', '),

            }
        })
    }


    //validando si no vienen archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se selecciono archivo'
            }
        });
    }
    //el archivo es el nombre del input
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    //moviendo el archivos
    // Use the mv() method to place the file somewhere on your server

    //arreglo de extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //obteniendo la extension del archivo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //si no lo encuentra
    if (extensionesValidas.indexOf(extension) < 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones validas son ' + extensionesValidas.join(', '),
                ext: `Extension recibida ${extension}`
            }
        })
    }
    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        //aca la imagen ya se cargo
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});



function imagenProducto() {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }


        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.json({
                ok: false,
                err
            })
        }
        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }


        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreImagen, tipo) {
    //antes de borrar vamos a confirmar que la imagen exista
    //verificando la ruta


    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}
module.exports = app;