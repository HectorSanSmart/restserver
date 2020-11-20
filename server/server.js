const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const path = require('path'); //libreria para trabajar los paths

require('./config/config');
app.use(require('./routes/index')); //configuracion  global de la rutas

//habilitar la carpeta public para que sea acceddida
app.use(express.static(path.resolve(__dirname, './public')));
console.log(path.resolve(__dirname, '../public/'));

//la forma en que se envian parametros
// parse application/x-www-form-urlencoded
//estas son funciones que se van a disparar siempre
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//conectandome a la base de datos de mongodb
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");

})