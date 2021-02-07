'use strict';

const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const dao = require('../models/episodes-dao.js');

//add a comments to episode with id = episodeID
router.post('/:episodeId/comments',[

  check('comment').isLength({min:3,max:20}),
],function(req,res,next){

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(500).json({error:'Commento non valido'});
  }else{
    const episodeId = req.params.episodeId;
    const comment = req.body.comment;

    dao.newComment(req.user.username,episodeId,comment)
      .then((lastID)=> {
        res.status(201).json({'lastID' : lastID,'author':req.user.username})
      })
      .catch((err)=> {
        res.status(500).json({error:'Impossibile aggiungere il commento'});
    });
  }
  });
  
  //delete the comments with id = idComment
  router.delete('/comments/:idComment',function(req,res,next){
  
      const idComment = req.params.idComment;
  
      dao.deleteComment(idComment).then(()=>{
        res.status(200).end();
      }).catch((err)=> res.status(500).json({error:'Impossibile eliminare il commento'}));
  });

  module.exports = router;