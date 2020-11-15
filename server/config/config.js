//==========================
//Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
//Seed token
//==========================
//vencimieno del token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//SEED O SEMILLA
process.env.SEED = process.env.SEDD || 'seed-desarrollo';


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
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;