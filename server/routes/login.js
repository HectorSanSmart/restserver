const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const app = express();

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    //con el payload obtenemos la info del usuario
    const payload = ticket.getPayload();
    console.log(payload.email);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}



//validando eltoken de google
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;


    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    })

    //verificando que no haya usuarios con ese correo
    Usuario.findOne({ email: googleUser.email }, (err, usuairoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: e
            });
        }
        if (usuairoDB) {
            if (usuairoDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                //en caso que ya este autenticado, entonces se renueva el token
                let token = jwt.sign({
                    //este es el payload
                    usuario: usuairoDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok: true,
                    usuairo: usuairoDB,
                    token
                })
            }
        }
        //si el usuario no existe en la bdd, creamos uno
        else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuairoDB) => {
                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }
                //en caso que ya este autenticado, entonces se renueva el token
                let token = jwt.sign({
                    //este es el payload
                    usuario: usuairoDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok: true,
                    usuairo: usuairoDB,
                    token
                })


            })


        }

    })

})

module.exports = app;