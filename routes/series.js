'use strict';

const express = require('express');
const router = express.Router();
const seriesDao = require('../models/series-dao.js');
const episodesDao = require('../models/episodes-dao.js');

//get all series or series filtered by title,description and category
router.get('/', async function(req, res, next) {
  
  const titleSubstr = req.query.title || '';
  const descriptionSubstr = req.query.description || '';
  const category = req.query.category!='all' && req.query.category ? req.query.category : ''; 
  
  let categories = [];
  let loggedIn = req.user ? true : false;
  const creator = loggedIn && req.user.creator;
  
  let series =  await seriesDao.getSeries(req.user,titleSubstr,descriptionSubstr,category);
  
  if(!series.error){
    
    if(loggedIn){
      let seriesFollowed = await seriesDao.getFollowedSeries(req.user.username);
      
      if(!seriesFollowed.error){
        seriesFollowed.forEach((sf) => {
          series.forEach((s) => {
              if (sf.title === s.title) s.following = true;
          });
        })}      
    }

      categories =  [...new Set(series.map(s => s.category))];
  }else{

    req.app.locals.message = series.error;
    req.app.locals.color = 'secondary';
  }

  res.render('series',{series,categories,loggedIn,title:'Cerca serie',message:req.app.locals.message,color:req.app.locals.color,research:true,typeResearch:'series',creator});
  req.app.locals.previousPage = '/';
  req.app.locals.message = '';
  req.app.locals.color = '';
});


router.get('/:seriesTitle/info',async(req,res)=>{

  const title = req.params.seriesTitle;
  let series = [];
  let episodes = [];
  let comments = {};

  let loggedIn = false;
  const creator = loggedIn && req.user.creator;
  try{
    series = await seriesDao.getSeriesByTitle(title);
  
    if(!series.error){
      
      if(req.user){
        loggedIn = true;
        
        if(series.author===req.user.username) series.created = true;
        else{
          const isFollowed = await seriesDao.isFollowed(req.user.username,title);
          
          if(isFollowed) series.following = true;
        }  
      }
      
      episodes = await episodesDao.getSeriesEpisodes(title);

      if(episodes.error) episodes = [];
      else {
        
        for(let e of episodes){
            
          let commentsEpisode = await episodesDao.getEpisodeComments(e.id);
          
          if(!commentsEpisode.error) {
            commentsEpisode.forEach((c)=>{
              if(loggedIn && c.author===req.user.username){
                c.created = true; 
              }});
              comments[e.id] = commentsEpisode;
            } else comments[e.id] = [];
          }

        if(loggedIn && !series.created){
          
          let favoriteEpisodes = await episodesDao.getFavoriteEpisode(req.user.username);
  
          if(!favoriteEpisodes.error){
          favoriteEpisodes.forEach((fe)=>{
            episodes.forEach((e)=>{
              if(fe.id===e.id)
                e.favorite = true;
            });
          })};
  
          let purchasedEpisodes = await episodesDao.getPurchasedEpisodes(req.user.username);
                  
          if(!purchasedEpisodes.error){
            purchasedEpisodes.forEach((pe)=>{
              episodes.forEach((e)=>{
                if(pe.id===e.id)
                  e.purchased = true;
              });
            })};
          }  
          
      } 
    }
  }catch(err){    
    req.app.locals.message = err;
    req.app.locals.color = danger;
  }finally{
    res.render('info-series',{title : 'info serie',loggedIn,series,episodes,color:req.app.locals.color,message:req.app.locals.message,comments,creator});
    
    req.app.locals.message = '';
    req.app.locals.color = '';
    req.app.locals.previousPage = `/${title}/info`;
  }
  });


module.exports = router;
