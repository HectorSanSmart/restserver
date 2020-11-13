//==========================
//Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;


//==========================
//Entorno
//==========================
//si no existe estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
//BDD   
//==========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://strider:admin123@cluster0.a7o0a.mongodb.net/cafe';
}


process.env.URLDB = urlDB;