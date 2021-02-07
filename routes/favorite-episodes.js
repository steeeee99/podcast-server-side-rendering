'use strict';

const express = require('express');
const router = express.Router();
const dao = require('../models/episodes-dao.js');

//get all favorite episodes
router.get('/',async function(req, res, next) {
    
    let episodes;
  
    try{
        //get all user's favorite episode
      episodes = await dao.getFavoriteEpisode(req.user.username);
      
      //check if episodes has some episode
      if(!episodes.error){
        
          //get episodes purchased by the user  
          let purchasedEpisodes = await dao.getPurchasedEpisodes(req.user.username);
          
          if(!purchasedEpisodes.error){
            purchasedEpisodes.forEach((pe)=>{
              episodes.forEach((e)=>{
                if(pe.id===e.id)
                  e.purchased = true;
              });
            })};
        }else{
            req.app.locals.color = 'secondary';
            req.app.locals.message = episodes.error;
            episodes = [];
        }
    }catch(e){
      console.log(e);
    }finally{
      res.render('episodes',{episodes,title:'Episodi preferiti',message:req.app.locals.message,color:req.app.locals.color,research:false,loggedIn:true,creator:req.user.creator});
      req.app.locals.message = '';
      req.app.locals.color = '';
    }});
  
  //an user delete an episode from his favorites
  router.delete('/:idEpisode', function(req, res, next) {
  
      const idEpisode = req.params.idEpisode;
        
      dao.deleteFavoriteEpisode(req.user.username,idEpisode).then(()=>{
        res.status(200).end();
      }).catch((err)=>{
        res.status(500).json({error:"Impossibile rimuovere dai preferiti"});
      });
    });
  
  //an user add an episode to his favorites
  router.post('/',function(req,res,next){
  
      const id = req.body.id;
  
      dao.newFavoriteEpisode(req.user.username,id).then(()=>{
        res.status(200).end();
      }).catch((err)=>{
        res.status(500).json({error:"Impossibile aggiungere ai preferiti"});
      });
  });
  
  module.exports = router;