const express = require('express');
const router = express.Router();

//Traer moduelo
let Articulo = require('../models/article');
// Modelo de usuario
let User = require('../models/user');

//Load Edit Form
router.get('/editar/:id', asegurarAuth, function (req, res) {
    Articulo.findById(req.params.id, function (err, articulo) {
        User.findById(articulo.author, function (err, user) {
            if (articulo.author != req.user._id) {
                req.flash('danger', 'Debes ser el autor del post para poder editarlo');
                res.redirect('/');
            }
            res.render('editar', {
                title: 'Bienvenido',
                articulo: articulo,
                nombre: user.username
            })
        })
    });
})

//Add Routes
router.get('/add', asegurarAuth, function (req, res) {
    res.render('add', {
        title: 'Añadir Articulos'
    });
});

//Añadir articulo
router.post('/add', function (req, res) {
    req.checkBody('title', 'Titulo es requerido').notEmpty();
    //req.checkBody('author', 'Autor es requerido').notEmpty();
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
        articulo.author = req.user._id;
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
    if (!req.user._id) {
        res.status(500).send();
        
    }
    let query = { _id: req.params.id }

    Articulo.findById(req.params.id, function (err, articulo) {
        if (articulo.author != req.user._id) {
            res.status(500).send();
            console.log('aqui')
        } else {
            Articulo.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Has eliminado un articulo correctamente');
            })
        }
    })
})

//Get Single Article
router.get('/:id', function (req, res) {
    Articulo.findById(req.params.id, function (err, articulo) {
        User.findById(articulo.author, function (err, user) {
            res.render('articulo', {
                articulo: articulo,
                author: user.username

            });
        });
    });
})

//Access Control
function asegurarAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Debes logearte para poder escribir');
        res.redirect('/users/login');
    }
}
module.exports = router;