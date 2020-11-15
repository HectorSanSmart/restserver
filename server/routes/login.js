const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const app = express();

const jwt = require('jsonwebtoken');


app.post('/login', (req, res) => {

    let body = req.body;
    //obteniendo el usuario por el email
    Usuario.findOne({ email: body.email }, (err, usuairoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        ///validando que el email no exista
        if (!usuairoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        //comparando las contraseñas
        if (!bcrypt.compareSync(body.password, usuairoDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //luego que pasa las validaciones genero el token para el usaurio
        let token = jwt.sign({
            //este es el payload
            usuario: usuairoDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok: true,
            usuario: usuairoDB,
            token //mamdnoe el token creado
        })

    })

})


module.exports = app;