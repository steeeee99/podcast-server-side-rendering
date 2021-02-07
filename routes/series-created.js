'use strict';

const express = require('express');
const router = express.Router();
const dao = require('../models/series-dao.js');
const {check, validationResult} = require('express-validator');
const fs = require('fs');


//if the user is a creator, render the page with all the series created by the user
router.get('/', function(req, res, next) {
    dao.getSeriesCreated(req.user.username).then((series)=>{
  
      if(series.error){
        series = [];
        req.app.locals.message = 'Non hai creato nessuna serie';
        req.app.locals.color = 'secondary';
      }
      res.render('series-created',{series,title:'Serie create', message:req.app.locals.message,color:req.app.locals.color,followingButton:false,editAndDeleteButtons:true,creator:true});
      req.app.locals.message = '';
      req.app.locals.color = '';
    });  
});


//if the user is a creator, render the page with the form to create a series
router.get('/new', function(req, res, next) {

    res.render('new-or-edit-series',{title: 'Crea una serie',series:undefined,message:'',add:true,creator:true});
});


//if the user is creator, add new series
router.post('/new',[
  check('title').isLength({min:3,max:20}),
  check('description').isLength({min:10,max:200}),
  check('category').isLength({min:5,max:20})
],function(req,res,next){
 
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      req.app.locals.message = 'Dati serie non validi';
      req.app.locals.color = 'danger';
      res.redirect('/created');
    }
    else{
      const title = req.body.title;
      const description = req.body.description;
      const category = req.body.category;
    
      const file = req.files.img;
  
      //move the image in directory '/public/images
      const url = `/images/${title}.png`;
        file.mv(__dirname + './../public' + url, (error) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.status(201);
            }
        });
      
        dao.newSeries(req.user.username,title,description,category,url).then(()=>{
          res.redirect('/created');
        });
    }
});


//get info series by title and render the page to update the series
router.get('/:title/edit', function(req, res, next) {
  
  dao.getSeriesByTitle(req.params.title).then((series)=>{

    res.render('new-or-edit-series',{series,title: 'Modifica serie',message:'',add:false,creator:true});
  });
});


//update the series' description and title
router.put('/:title/edit',[
  check('title').isLength({min:3,max:20}),
  check('description').isLength({min:10,max:200}),
],function(req, res, next) {
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      req.app.locals.message = 'Dati serie non validi';
      req.app.locals.color = 'danger';
      res.redirect('/created');
    }
    else{
        const title = req.params.title;
        const description = req.body.description;
  
        dao.updateSeries(title,description)
        .then(()=>res.status(201).end())
        .catch(()=>res.status(500).end());}
});


//delete the series with the title = seriesTitle
router.delete('/:seriesTitle', (req, res) => {

  const title = req.params.seriesTitle;

  dao.deleteSeries(title)
      .then(() => {
          fs.unlink(__dirname + `./../public/images/${title}.png`, function(err) {
            if (err) {
                 return res.status(500).json({ error: "Impossibile cancellare la serie"});
              } else {
                  res.status(200).end();
              }
          });
      })
      .catch(() => {
     return res.status(404).json({error: "Impossibile cancellare la serie"});})
});

module.exports = router;