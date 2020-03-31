const express = require('express');
let {verificarToken,verificaAdmin} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
let Usuario = require('../models/usuario');

// =========================
// Mostrar todas las categorias
// =========================
app.get('/categoria',verificarToken,(req,res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err,categorias) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias: categorias
            });
        })
});

// =========================
// Mostrar una categoria por ID
// =========================

app.get('/categoria/:id',verificarToken,(req,res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario','nombre email')
        .exec((err,categoriaDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if(!categoriaDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no existe'
                    }
                });
            }
    
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })

});


// =========================
// Crear una nueva categoria
// =========================
app.post('/categoria',verificarToken,(req,res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =========================
// Actalizar una categoria
// =========================
app.put('/categoria/:id',verificarToken,verificaAdmin,(req,res) => {
    let id = req.params.id

    let {descripcion} = req.body;
    let categoria = {
        descripcion
    }
    Categoria.findByIdAndUpdate(id,categoria,{new: true,runValidators: true},(err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// =========================
// Eliminar una categoria
// =========================
app.delete('/categoria/:id',verificarToken,verificaAdmin,(req,res) => {
    // solo un administrador puede eliminar categorias
    // elimiado logico
    let id = req.params.id

    Categoria.findByIdAndRemove(id,(err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria Borrada'
        });
    });
});




module.exports = app;

