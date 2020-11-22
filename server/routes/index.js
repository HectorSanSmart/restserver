const express = require('express');
const app = express();
app.use(require('./usuario')); //importando y usando las rutas del usuario
app.use(require('./login')); //importando y usando las rutas del login
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));
//exportando los modulos
module.exports = app;