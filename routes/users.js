'use strict';

var express = require('express');
var router = express.Router();
const dao = require('../models/user-dao.js');
const fs = require('fs');

router.get('/account', function(req, res, next) {
  
  dao.getUserData(req.user.username).then((accountData)=>{

    res.render('account',{username:req.user.username,user:accountData,title:'Dati account',message:req.app.locals.message,color:req.app.locals.color,creator:req.user.creator});
  });
});

router.put('/account/photo',function(req,res,next){

  const path = __dirname + `./../public/images/${req.user.username}.png`;
  
  fs.readFile(path,function(err,file){
        if(!err)
          fs.unlinkSync(path,(err)=>{
            if(err){
              res.status(500).json({err: err}).end();
            }
          });

          const img = req.files.img;
        
          img.mv(path, function(error) {
          if (error) {  
              res.status(500).json({ error: error });
          };
        });          
        });
        dao.updateAccountPhoto(req.user.username,`/images/${req.user.username}.png`).then(()=>{
          res.status(200).end();
      });
});
  

module.exports = router;
