require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/usuario');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/',routes);

mongoose.connect(process.env.URLDB,(err,res) => {
    if(err) throw err;

    console.log('Base de datos Onlne');
});
 
app.listen(process.env.PORT,() => {
    console.log('Escuchando el puerto ', process.env.PORT);
})