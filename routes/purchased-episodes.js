'use strict';

const express = require('express');
const router = express.Router();
const dao = require('../models/episodes-dao.js');
const {check, validationResult} = require('express-validator');

router.get('/:episodeId/payment',function(req,res,next){
    
    const episodeId = req.params.episodeId;

    dao.getEpisodePrice(episodeId).then((episode)=>{
      res.render('payment',{episode:episode,message:req.app.locals.message,color:'danger',creator:req.user.creator})
    });
});

router.post('/',[
    check('credit-card-number').isLength(16),
    check('credit-card-number').isNumeric(),
    check('deadline').isAfter((new Date()).toDateString()),
    check('cvv').isLength(3),
    check('cvv').isNumeric(),
    ],function(req,res,next){

    const episodeId = req.body.episodeId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      req.app.locals.message = 'Carta non valida';
       
      res.redirect(`/episodes/${episodeId}/payment`);
    }else{
      dao.purchaseEpisode(req.user.username,episodeId).then(()=>{
        res.redirect(req.app.locals.previousPage);
      });
    }
});

module.exports = router;