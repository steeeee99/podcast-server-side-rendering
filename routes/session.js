'use strict';

const express = require('express');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const passport = require('passport');
const dao = require('../models/user-dao.js');

router.get('/users/:username/data',(req,res)=>{
  
  const username = req.params.username;
    
    dao.getUserByUsername(username)
    .then((user) => {
      
      res.status(200).json({user})
    })
    .catch((err) => {
      
      res.status(500).json({err : 'Errore server'});
    })
});
// Login page
router.get('/login', function(req, res, next) {
  res.render('login-signup',{login:true,title:'Login',message:req.app.locals.message,color:req.app.locals.color});
});

router.get('/signup', function(req, res, next) {

  res.render('login-signup',{login:false,title:'Iscriviti',message:req.app.locals.message,color:req.app.locals.color});
});


router.post('/signup',[
    check('username').isLength({min:5,max:15}),
    check('password').isLength({min:6,max:18}),
],async function(req,res,next){

  const errors = validationResult(req);
  if(!errors.isEmpty()){

      req.app.locals.message = 'Password o username non validi!';
      req.app.locals.color = 'danger';

      res.redirect('/signup');
  }else{
    const user = req.body;

    dao.createUser(user)
    .then((result)=>res.status(201).header('Location', `/users/${result}`).end())
    .catch((err)=>{
      
      res.status(503).json({error:"Errore durante l'iscrizione"});
  })}
});


/* Do the login */
router.post('/session', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    
    if (err) { return next(err) }
    
    if (!user) {
        // display wrong login messages
        return res.render('login-signup', {title:'Login',login:true,message: info.message,color:'danger'});
    }
    // success, perform the login
    req.login(user, function(err) {
      
      if (err) { return next(err); }
      // req.user contains the authenticated user
      req.app.locals.color = 'success';
      req.app.locals.message = `Benvenuto ${user.username}!`;
      res.redirect('/');
    });
  })(req, res, next)
});

router.delete('/session/current', function(req, res, next) {
  req.logout();
  res.end();
});

module.exports = router;