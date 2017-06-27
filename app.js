const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//init app
var app = express();

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connections
db.once('open', function(){
    console.log('Conectado a MongoDB');
})

//check for db errors
db.on('error', function(err){
   console.log(err);
})

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

//Traer moduelo
let Articulo = require('./models/article');
//home Route
app.get('/', function(req, res){
     
    Articulo.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
            res.render('index', {
        title: 'Aplicacion Alex',
        articles:articles
            });
        }
    /*let articles = [{
            id:1,
            title:"Article one",
            author:"Alex Colombo",
            body:"this is article one" },
        {
            id:2,
            title:"Article two",
            author:"Alex Colombo",
            body:"this is article two" },
        {
            id:3,
            title:"Article three",
            author:"Alex Colombo",
            body:"this is article three" }
    ]*/  
  });
});

//Add Routes
app.get('/articulos/add', function(req,res){
    res.render('add', {
        title: 'Añadir Articulos'     
    });
});

app.post('/articulos/add', function(req, res){
    let articulo = new Articulo();
    articulo.title = req.body.title;
    articulo.author = req.body.author;
    articulo.body = req.body.body;
    console.log(articulo);
    return;
})

//Start Server
app.listen(4000, function(){
    console.log('Escuchando en puerto 4000.......')
});