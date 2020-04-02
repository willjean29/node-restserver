const express = require('express');
const fileUpload = require('express-fileupload');
// importar modelos
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');
const Producto = require('../models/producto');

const app = express();
// middlewares
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req,res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecionado ningún archivo'
            }
        });
    }

    // validar tipo
    let tiposValidos = ['productos','usuarios']
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son '+tiposValidos.join(', '),
                ext: tipo
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son '+extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(tipo === 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);
        }else{
            imagenProducto(id,res,nombreArchivo);
        }
        
      });
});


function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioDB) => {
        if(err){
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err,usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    })
}

function imagenProducto(id,res,nombreArchivo) {
    Producto.findById(id,(err,productoDB) => {
        
        if(err){
            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img,'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err,productoGuardado) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borrarArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;