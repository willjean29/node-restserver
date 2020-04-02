const express = require('express');
const fs = require('fs');
const {verificarToken,verificarTokenImg} = require('../middlewares/autenticacion');
const path = require('path');
const app = express();


app.get('/imagen/:tipo/:img',verificarTokenImg,(req,res) => {
    let {tipo,img} = req.params;
    console.log(tipo,img)
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

    
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }

    
});

module.exports = app;