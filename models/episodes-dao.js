'use strict';

const db = require('../db.js');

//get all episodes of series that has title = seriesTitle
exports.getSeriesEpisodes = function(seriesTitle) {
    return new Promise((resolve, reject) => {
        const sql = "select id,title,id_audio,description,date,price,sponsor from episodes where series=?";

        db.all(sql, [seriesTitle], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows === undefined) resolve({ error: "Nessun episodio in questa serie." });
            else resolve(rows);
        })
    })
};

//if the user is logged in return all episodes not created or episodes filtered with title substring and description substring
//else return all episodes or episodes filtered witb title and descriptionSubstr
exports.getEpisodes = function(user,titleSubstr,descriptionSubstr) {
    return new Promise((resolve, reject) => {

        const sql = "select id,episodes.title,episodes.series,episodes.description,episodes.date,episodes.price,series.author from episodes join series on episodes.series=series.title where episodes.title like ? and episodes.description like ? order by episodes.date";

        db.all(sql,[`%${titleSubstr}%`,`%${descriptionSubstr}%`], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows === undefined) resolve({ error: "Nessun episodio trovato." });
            else {
                if(user){
                    rows = rows.filter((row)=> row.author!==user.username);
                }

                resolve(rows);
            }
        });
    });
};

//add an episode to series
exports.newEpisode = function(title, series, description, date, price,sponsor) {
    return new Promise((resolve, reject) => {

        const sql = 'insert into episodes(title,series,description,date,price,sponsor) values(?,?,?,?,?,?)';

        db.run(sql, [title, series, description, date, price,sponsor],function(err) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};

//update an episode's audio
exports.updateAudioUrl = function(episodeId,audioUrl){
    return new Promise((resolve,reject)=>{

        const sql = 'update episodes set id_audio = ? where id= ?';

        db.run(sql,[audioUrl,episodeId],function(err){
            if(err){
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};

//update description,price and sponsor of the episode with id = episodeId
exports.updateEpisode = function(episodeId,description,price,sponsor){
    return new Promise((resolve,reject)=>{

    const sql = 'update episodes set description = ?,price = ?, sponsor = ? where id=?';

    db.run(sql,[description,price,sponsor,episodeId],function(err){
        if(err){
            reject(err);
            return;
        }

        resolve(this.lastID);

    })

    });
};

//get all favorite episodes
exports.getFavoriteEpisode = function(user) {
    return new Promise((resolve, reject) => {
        const sql = "select id,title,description,date,price,series from favoriteEpisodes join episodes where favoriteEpisodes.episode=episodes.id and user=?";

        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length===0) resolve({ error: `Non hai episodi preferiti.` });
            else {
                const favoriteEpisodes = rows.map((e) => ({
                    id: e.id,
                    title: e.title,
                    series: e.series,
                    description: e.description,
                    date: e.date,
                    price: e.price,
                    favorite: true,
                }));

                resolve(favoriteEpisodes);
            }
        });
    });
};

//an user adds an episode to favorites
exports.newFavoriteEpisode = function(username, episode) {
    return new Promise((resolve, reject) => {

        const sql = 'insert into favoriteEpisodes values(?,?)';

        db.run(sql, [username, episode], (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};

//an user delete an episode from favorites
exports.deleteFavoriteEpisode = function(username, episode) {
    return new Promise((resolve, reject) => {

        console.log(username,episode);
        const sql = "delete from favoriteEpisodes where user=? and episode=?";

        db.run(sql, [username, episode],function(err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};

//return all purchased episodes
exports.getPurchasedEpisodes = function(user) {
    return new Promise((resolve, reject) => {
        const sql = "select id,title,description,id_audio,date from purchasedEpisodes join episodes where purchasedEpisodes.episode=episodes.id and user=?";

        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length === 0) reject({ error: `Nessun episodio acquistato dall'utente ${user}` });
            else {
                
                resolve(rows);
            };
        });
    });
};

//the user with username = username buy the episode with id = episode
exports.purchaseEpisode = function(username, episode) {
    return new Promise((resolve, reject) => {

        const sql = 'insert into purchasedEpisodes values(?,?)';

        db.run(sql, [username, episode], (err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};


exports.isFavorite = function(username,episodeID) {
    return new Promise((resolve,reject)=>{
        
        const sql = 'select * from favoriteEpisodes where user=? and episode=?';

        db.get(sql,[username,episodeID],(err,row)=>{
            if(err){
                reject(err);
                return;
            }


            if(row!==undefined) resolve(true);
            else resolve(false);
            
        });
    });
}; 

//get the episode by id
exports.getEpisodeInfo = function(episodeID){
    return new Promise((resolve,reject)=>{

        const sql = 'select id,episodes.title,episodes.description,series,id_audio,date,sponsor,price,series.author from episodes join series where episodes.series=series.title and id=?';

        db.get(sql,[episodeID],(err,row)=>{
            if(err){
                reject(err);
                return;
            }
            if(row===undefined) resolve({error:'Nessun episodio trovato'});
            else resolve(row);
        })


    });
};

//delete episode by id
exports.deleteEpisode = function(episodeID){
    return new Promise((resolve,reject)=>{

        const sql = 'delete from episodes where id = ?'
        db.get(sql,[episodeID],(err,row)=>{
            if(err){
                reject(err);
                return;
            }
            else resolve(row);
        })
    });
};


//get comments of episode with id = episodeId
exports.getEpisodeComments = function(episodeId) {
    return new Promise((resolve, reject) => {

        const sql = "select author,comment,episode,id from comments where episode=?";

        db.all(sql, [episodeId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows.length === 0 || rows === undefined) {
                resolve({ error: 'Nessun commento per questo episodio' });
            } else {
                resolve(rows);
            };
        });
    });
};
//the user add a comment to the episode
exports.newComment = function(username, episode, comment) {
    return new Promise((resolve, reject) => {

        const sql = 'insert into comments(author,episode,comment) values(?,?,?)';

        db.run(sql, [username, episode, comment], function(err){
            if (err) {
                reject(err);
                return;
            }
            
            resolve(this.lastID);
        });
    });
};

//delete a comment
exports.deleteComment = function(idComment){
    return new Promise((resolve,reject)=>{

    const sql = 'delete from comments where id = ?';

    db.run(sql,[idComment],function(err){
        if(err){
            reject(err);
            return;
        }

        resolve(this.lastID);
    });
    });
};

exports.getEpisodePrice = function(episodeId){
    return new Promise((resolve,reject)=>{

        const sql = 'select id,title,price from episodes where id = ?';

        db.get(sql,[episodeId],(err,row)=>{
            if(err){
                reject(err);
                return;
            }
            
            if(row===undefined) resolve({error:'Nessun episodio trovato'});
            else resolve(row);
        });
    });
};