'use strict';

const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const dao = require('../models/series-dao.js');

router.get('/', (req, res) => {
    dao.getFollowedSeries(req.user.username).then((series)=>{
      
      if(series.error){
        
        req.app.locals.message=series.error;
        req.app.locals.color='secondary';
        series = [];
      }
      res.render('series',{loggedIn:true,series,'research':false,title:'Serie seguite',message:req.app.locals.message,color:req.app.locals.color,followingButton:true,editAndDeleteButtons:false,creator:req.user.creator});
      req.app.locals.message = '';
      req.app.locals.color = '';
    });
  });
  
  router.post('/',[
    check('title').isLength({min:3,max:20}),
  ], (req, res) => {
  
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(500).json({error:'Impossibile seguire questa serie'});
    }
    const title = req.body.title;
  
    dao.followSeries(req.user.username,title)
    .then(()=>res.status(201).end())
    .catch((err)=>{ res.status(500).json({error:'Impossibile seguire questa serie'});})
  });
  
  
  router.delete('/:seriesTitle', (req, res) => {
  
    const title = req.params.seriesTitle;
  
    dao.unfollowSeries(req.user.username,title).then((lastID)=>{
      res.status(201).end();
    }).catch((err)=>{ res.status(500).json({error:'Impossibile seguire questa serie'});})
  });


  module.exports = router;