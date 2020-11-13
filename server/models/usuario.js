//este archivo es el encargado de trabajar el modelo de datos

const mongoose = require('mongoose');

//para controlar el unique
const uniqueValidator = require('mongoose-unique-validator');



let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}


//esta variable obtiene el esquema para crear objetos de mongoose
let Schema = mongoose.Schema;
//declarando el schema
let usuarioSchema = new Schema({
    //definiendo los campos
    nombre: {
        type: String,
        required: [true, 'El campo nombre no puede ser nulo']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email no puede ser nulo']
    },
    password: {
        type: String,
        required: [true, 'El campo password no puede ser nulo']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
//para que no se envie la contraseña en la respuetas
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


//diciendo al schema que vamos a usar el pluggin de unique mongoose
usuarioSchema.plugin(uniqueValidator, {
    //aqui se inyecta el mensaje de error
    message: '{PATH} Debe ser unico'
});

//exportando el modelo      //nombre del modelo o tabla, la info que tendra el modelo 
module.exports = mongoose.model('Usuario', usuarioSchema);