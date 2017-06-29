const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//init app
var app = express();

//Traer moduelo
let Articulo = require('./models/article');


mongoose.connect(config.database);
let db = mongoose.connection;

//check connections
db.once('open', function () {
    console.log('Conectado a MongoDB');
})

//check for db errors
db.on('error', function (err) {
    console.log(err);
})

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Express Session Midleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Midleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express Validator Midleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

//home Route
app.get('/', function (req, res) {

    Articulo.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Aplicacion Alex',
                articles: articles
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

//Route Files;
let articulos = require('./routes/articulos');
let users = require('./routes/users');
app.use('/articulos', articulos)
app.use('/users', users)

//Start Server
app.listen(4000, function () {
    console.log('Escuchando en puerto 4000.......')
});