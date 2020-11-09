const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('./config/config');
// parse application/x-www-form-urlencoded
//estas son funciones que se van a disparar siempre
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('get Usuario')
});



app.post('/usuario', function(req, res) {

    let body = req.body; //el body viene del body parser
    //el nombre es el campo del json que estoy recibiendo con esa propiedad
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        })
    }
});


app.put('/usuario/:id', function(req, res) {
    //obteninedo el usuario, el :/id hace referencia al id que se envia
    //en esta caso el path es localhost:3000/usuario/:id
    let codigo = req.params.id; //obteniendo el id enviado 
    res.json({
            codigo
        })
        //res.json('put Usuario')
});


app.delete('/usuario', function(req, res) {
    res.json('delete Usuario')
});


app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
})