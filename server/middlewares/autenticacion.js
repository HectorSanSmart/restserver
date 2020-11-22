//este archivo es para la verificaion del token
const jwt = require('jsonwebtoken');


//esto va a leer el token que viene en el header
let verificaToken = (req, res, next) => {
    let token = req.get('token'); //obteniendo el token
    //verifcando el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        //obteniendo el payload
        req.usuario = decoded.usuario;

        //con el next se ejecuta toda la funcion que sigue despues del middleware

        next();
    })
};

//==========================================
//VErifica AdminRole
//dependiendo del role se podran hacer updates e inserts
let verificaAdmin_Role = (req, res, next) => {
    //obteniendo el usuario
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }
}


//================
//Verifica token para imagen

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    //verifcando el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        //obteniendo el payload
        // req.usuario = decoded.usuario;

        //con el next se ejecuta toda la funcion que sigue despues del middleware

        next();
    })


}
module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}