const express = require('express');
const app = express();
app.use(require('./usuario')); //importando y usando las rutas del usuario
app.use(require('./login')); //importando y usando las rutas del login

//exportando los modulos
module.exports = app;