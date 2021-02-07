'use strict';

const express = require('express');
const router = express.Router();
const moment = require('moment');
const dao = require('../models/episodes-dao.js');
const {check, validationResult} = require('express-validator');
const fs = require('fs');


//render the page to add an episode to the series with title = seriesTitle
router.get('/:seriesTitle/new',function(req,res,next){

    const series = req.params.seriesTitle;
  
    res.render('new-or-edit-episode',{title:'Crea un episodio',series: series,episode:null,message:'',add:true,creator:true});
  
  });

//render the page to update episode's with id = episodeId
router.get('/:episodeId/edit',function(req,res,next){

    const episodeId = req.params.episodeId;
    
    dao.getEpisodeInfo(episodeId).then((episode)=>{
      res.render('new-or-edit-episode',{title:'Modifica episodio',series: episode.series,episode:episode,message:'',add:false,creator:true});
    })
  });
  
//update description,price,sponsor to the episode with id = episodeId 
  router.put('/:episodeId',function(req,res,next){
   
    const episodeId = req.params.episodeId;
    const description = req.body.description;
    const price = req.body.price!=='' ? req.body.price : 0;
    const sponsor = req.body.sponsor!=='' ? req.body.sponsor : null;
  
    dao.updateEpisode(episodeId,description,price,sponsor).then(()=>{
      res.status(201).end();
    })
  
  });
  //create a new episode
  router.post('/',[
    check('title').isLength({min:3,max:20}),
    check('series').isLength({min:3,max:20}),
    check('description').isLength({min:10,max:200}),
],async function(req,res,next){
  
  const title = req.body.title;
    const series = req.body.series;
    const description = req.body.description;
    const date = moment().format('L');
    const price = req.body.price!=='' ? req.body.price : 0;
    const sponsor = req.body.sponsor!=='' ? req.body.sponsor : null;

    const file = req.files.audio;
    
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    req.app.locals.message = 'Dati episodio non validi';
    req.app.locals.color = 'danger';
  }else{
    
  try{
    const episodeLastId = await dao.newEpisode(title,series,description,date,price,sponsor);

    const audio_url = `/audios/${episodeLastId}.mp3`;
        file.mv(__dirname + './../public' + audio_url, (error) => {
          if (error) {
            res.status(500).json({ error: error });
          }});
          await dao.updateAudioUrl(episodeLastId,audio_url);
  }catch(e){
   req.app.locals.message = e.error;
   req.app.locals.color = 'danger';
  }}
    res.redirect(`/${series}/info`);

  });
  
  //delete the episode with id = episodeId
  router.delete('/:episodeId', (req, res) => {
  
    const episodeId = req.params.episodeId;
  
    dao.deleteEpisode(episodeId)
        .then(() => {
          fs.unlink(__dirname + `./../public/audios/${episodeId}.mp3`, function(err) {
            if (!err) res.status(200).end();
          });
        })
        .catch(() => { res.status(404).json({error : "Impossibile eliminare l'episodio" })});
  });


  module.exports = router;