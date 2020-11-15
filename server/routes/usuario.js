const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bodyParser = require('body-parser');

//para el token
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
//para trabajar objetcos
const _ = require('underscore');
//encriptar la contraseña

const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//============================================================
//Peticion que trae los usuario activos
//un midleware
app.get('/usuario', verificaToken, (req, res) => {


    return res.json({
            //el req.usuario lo definimos en el archivo de aunteticacion en la parte de verificaToken
            usuario: req.usuario
        })
        //en req.query vienen los parametros opcionales
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    //paginando el listado
    //el skip es los saltos
    //el limit es la cantidad de registros
    //aqui mostramos todos los registros
    //si queremos validaciones se colocan entre las {}
    //y se colocarian en el count
    //en las comillas definimos que campos queremos mostrar
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })
            })
        })

});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    //extranedo lo que viene en el post o peticion
    let body = req.body; //el body viene del body parser
    //pasando los parametro a guardar
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //aqui se encripta
        role: body.role
    });
    //guardando en la bdd,
    //puedo obtener un error,
    //o la respuesta del usuario que se guardo en mongo
    //el .save es propio de mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        //usuarioDB.password = null
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

    //   el nombre es el campo del json que estoy recibiendo con esa propiedad
    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario'
    //     })
    // } else {
    //     res.json({
    //         persona: body
    //     })
    // }
});


app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    //obteninedo el usuario, el :/id hace referencia al id que se envia
    //en esta caso el path es localhost:3000/usuario/:id
    let codigo = req.params.id; //obteniendo el id enviado 
    //pick nos permite indicar que parametros son permitidos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //el new nos devuelve el objeto ya actualizado
    Usuario.findByIdAndUpdate(codigo, body, { new: true, runValidators: true }, (err, resBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            usuario: resBD

        });
    })


    //res.json('put Usuario')
});


app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    //borrando el usuario fisicamente
    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!usuarioBorrado) {

            return res.status(400).json({
                ok: true,
                error: {
                    message: 'Usuario no encontrado'
                }
            })

        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })*/

    //cambiando el estado del usaurio 
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, resBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            usuario: resBD

        });
    })


    // res.json('delete Usuario')
});


module.exports = app;