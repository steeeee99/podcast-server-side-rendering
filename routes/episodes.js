'use strict';

var express = require('express');
var router = express.Router();
const dao = require('../models/episodes-dao.js');

//get all episodes or episodes filtered by title and description
router.get('/', async function(req, res, next) {

  const titleSubstr = req.query.title || '';
  const descriptionSubstr = req.query.description || '';

  let loggedIn = false;
  const creator = loggedIn && req.user.creator;

  let episodes = [];
  
  try{
    episodes = await dao.getEpisodes(req.user,titleSubstr,descriptionSubstr);
    if(!episodes.error && req.user){
      
      loggedIn = true;
      const favoriteEpisodes = await dao.getFavoriteEpisode(req.user.username);
      
            if(!favoriteEpisodes.error){
              favoriteEpisodes.forEach((fe)=>{
                episodes.forEach((e)=>{
                  if(fe.id===e.id) e.favorite = true;
                });
              });
            }
            
      const purchasedEpisodes = await dao.getPurchasedEpisodes(req.user.username);
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
    }
    }catch(e){
      console.log(e);
    }finally{
      res.render('episodes',{episodes:episodes,loggedIn,categories:null,title:'Cerca episodi',message:req.app.locals.message,color:req.app.locals.color,research:true,typeResearch:'episodes',creator});
      req.app.locals.color = 'secondary';
      req.app.locals.message = episodes.error;
    }
});

module.exports = router;