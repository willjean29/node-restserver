const express = require('express');

const {verificarToken,verificaAdmin} = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const app = express();

// =========================
// Obtener todas los productos
// =========================

app.get('/producto',verificarToken,(req,res) => {
    // trae todos los productos
    // populate
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err,productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos: productos
            });
        })
});


// =========================
// Obtener un producto por ID
// =========================

app.get('/producto/:id',verificarToken,(req,res) => {
    // trae todos los productos
    // paginado
    let id = req.params.id;
 
    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err,productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productoDB){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
});

// =========================
// Buscar un producto por su nombre
// =========================

app.get('/producto/buscar/:termino',verificarToken,(req,res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Producto.find({nombre: regex})
        .populate('categoria','descripcion')
        .exec((err,productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos: productos
            });
        })
})

// =========================
// Obtener un producto por ID
// =========================

app.post('/producto',verificarToken,(req,res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let {nombre,precioUni,decripcion,categoria} = req.body;

    let producto = new Producto({
        nombre: nombre,
        precioUni: precioUni,
        decripcion: decripcion,
        categoria: categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// =========================
// Actualizar un producto por ID
// =========================

app.put('/producto/:id',verificarToken,(req,res) => {
    let id = req.params.id;
    let body = req.body;
    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    };

    Producto.findByIdAndUpdate(id,producto,{new: true, runValidators: true},(err,productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

// =========================
// Eliminar un producto por ID
// =========================

app.delete('/producto/:id',verificarToken,(req,res) => {
    let id = req.params.id;
    let producto = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id,producto,{new: true, runValidators: true},(err,productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});





module.exports = app;