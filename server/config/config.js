// =========================
// PUERTO
// =========================

process.env.PORT = process.env.PORT || 3000;

// =========================
// ENTORNO
// =========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================
// Venficmiento del token
// =========================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========================
// SEED de autentificación
// =========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =========================
// Base de Datos
// =========================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =========================
// Google Client ID
// =========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '719614499824-d95sfu4q5dvqur3tul579518hi9r1shr.apps.googleusercontent.com';

