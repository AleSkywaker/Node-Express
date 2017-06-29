const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//Traer usuario modelo
let User = require('../models/user');

//Load Form para Register
router.get('/register', function (req, res) { 
        res.render('register', {
            title: 'Formulario de Registro',    
    });
});

//Registrarse
router.post('/register', function(req,res){
 const name = req.body.name;
 const email = req.body.email;
 const username = req.body.username;
 const password = req.body.password;
 const password2 = req.body.password2;

 console.log(name)

 req.checkBody('name', 'nombre es requerido').notEmpty();
 req.checkBody('email', 'email es requerido').notEmpty();
 req.checkBody('email', 'email no válido').isEmail();
 req.checkBody('username', 'usernombre es requerido').notEmpty();
 req.checkBody('password', 'contraseña es requerida').notEmpty();
 req.checkBody('password2', 'contraseña no coincide').equals(req.body.password);

 let errors = req.validationErrors();

   if(errors){
       res.render('register',{
           errors:errors
       });
   }else{
       let newUser = new User({
           name:name,
           email:email,
           username:username,
           password:password
       });   
       bcrypt.genSalt(10, function(err, salt){
           bcrypt.hash(newUser.password, salt, function(err, hash){
               if(err){
                   console.log(err);
               }
               newUser.password = hash;
               newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success', 'Te has registrado correctamente y puedes logearte');
                        res.redirect('/users/login');
                    }
               })
           })
       })
   }
});

router.get('/login', function(req, res){
  res.render('login',{
      title: 'Logearte'
  });
})

module.exports = router;