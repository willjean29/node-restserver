
const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0;
    desde = parseInt(desde);

    let limite = req.query.limite || 0;
    limite = parseInt(limite);
    Usuario.find({estado: true},'nombre email roel estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.count({estado: true},(err,conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cantidad: conteo
                    });
                })

            });
  })
  
app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,bcrypt.genSaltSync(10)),
        role: body.role
    });

    usuario.save((err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

})
  
app.put('/usuario/:id', function (req, res) {
    let {id} = req.params;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,body,{new: true, runValidators: true},(err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDB  
        })
    })

})
  
// app.delete('/usuario/:id', function (req, res) {
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id,(err,usuarioBorrado) => {
//         if(err){
//             return res.status(400).json({
//                 ok: false,
//                 err
//             })
//         }

//         if(!usuarioBorrado){
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             })
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     })
// })

app.delete('/usuario/:id',(req,res) => {
    let {id} = req.params;
    let body = {
        estado : false
    }
    Usuario.findByIdAndUpdate(id,body,{new: true, runValidators: true},(err,usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado  
        })
    })
})
  
  module.exports = app;