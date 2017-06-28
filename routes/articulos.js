const express = require('express');
const router = express.Router();

//Traer moduelo
let Articulo = require('../models/article');

//Load Edit Form
router.get('/editar/:id', function (req, res) {
    Articulo.findById(req.params.id, function (err, articulo) {
        res.render('editar', {
            title: 'Editar articulo',
            articulo: articulo
        })
    });
})

//Add Routes
router.get('/add', function (req, res) {
    res.render('add', {
        title: 'Añadir Articulos'
    });
});

//Añadir articulo
router.post('/add', function (req, res) {
    req.checkBody('title', 'Titulo es requerido').notEmpty();
    req.checkBody('author', 'Autor es requerido').notEmpty();
    req.checkBody('body', 'Descripcion es requerido').notEmpty();

    //Get errors
    let errors = req.validationErrors();
    if (errors) {
        res.render('add', {
            title: 'Añadir Articulos',
            errors: errors
        });
    } else {
        let articulo = new Articulo();
        articulo.title = req.body.title;
        articulo.author = req.body.author;
        articulo.body = req.body.body;

        articulo.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Has añadido un articulo')
                res.redirect('/')
            }
        })
    }
})
//update submit
router.post('/editar/:id', function (req, res) {
    let articulo = {};
    articulo.title = req.body.title;
    articulo.author = req.body.author;
    articulo.body = req.body.body;

    let query = { _id: req.params.id };

    Articulo.update(query, articulo, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('warning', 'Has actualizado un articulo')
            res.redirect('/')
        }
    })
})
//Delete Request
router.delete('/:id', function (req, res) {
    let query = { _id: req.params.id }

    Articulo.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Has eliminado un articulo correctamente');
    })
})

//Get Single Article
router.get('/:id', function (req, res) {
    Articulo.findById(req.params.id, function (err, articulo) {
        res.render('articulo', {
            articulo: articulo
        })
    });
})

module.exports= router;