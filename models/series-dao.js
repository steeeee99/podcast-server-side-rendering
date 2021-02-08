'use strict';

const db = require('../db.js');


//get all series or filtered with title substring, description substring and category
exports.getSeries = function(user,titleSubstr,descriptionSubstr,category) {
    return new Promise((resolve, reject) => {
        
        const sql = "select title,description,url_img,category,author from series where title like ? and description like ? and category like ?";

        db.all(sql, [`%${titleSubstr}%`,`%${descriptionSubstr}%`,`%${category}%`], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined) resolve({ error: "Nessuna serie trovata." });

            if(user){
                rows = rows.filter((row)=>row.author!==user.username);
            }

            resolve(rows);
        });
    });
};

//get all series created by the user with username = username
exports.getSeriesCreated = function(username) {
    return new Promise((resolve, reject) => {
        const sql = "select title,description,url_img,category,author from series where author=?";

        db.all(sql, [username], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length === 0 || rows === undefined) resolve({ error: "Nessuna serie trovata." });

            resolve(rows);
        });
    });
};

//get all series followed by the user with username = username
exports.getFollowedSeries = function(username) {
    return new Promise((resolve, reject) => {
        const sql = "select title,description,url_img,category,author from followedSeries join series where followedSeries.series=series.title and user=?";

        db.all(sql, [username], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length===0) resolve({ error: 'Nessuna serie seguita' });

            rows = rows.map((row)=>({
                title : row.title,
                description : row.description,
                url_img : row.url_img,
                category : row.category,
                author : row.author,
                following : true,
            }));
            resolve(rows);
        });
    });
};

//return the series with title = seriesTitle
exports.getSeriesByTitle = function(seriesTitle) {
    return new Promise((resolve, reject) => {

        const sql = "select title,description,url_img,category,author from series where title=?";

        db.get(sql, [seriesTitle], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row === undefined) resolve({ error: "Nessuna serie trovata." });

            resolve(row);
        });
    });
};

//ad user deletes a series
exports.deleteSeries = function(title) {
    return new Promise((resolve, reject) => {

        const sql = 'delete from series where title = ?';

        db.run(sql, [title], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

//an user updates a series
exports.updateSeries = function(title, description) {
    return new Promise((resolve, reject) => {

        const sql = 'update series set description = ? where title = ?';

        db.run(sql, [description, title], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

//an user follows a series
exports.followSeries = function(username, series) {
    return new Promise((resolve, reject) => {
        const sql = "insert into followedSeries values(?,?)";
        
        db.run(sql, [username, series], function(err) {
            if (err) {
                reject(err);
                return;
            } 
            resolve(this.lastID);
        });
    });
}; 

//an user unfollows a series
exports.unfollowSeries = function(username, series) {
    return new Promise((resolve, reject) => {

        const sql = "delete from followedSeries where user=? and series=?";

        db.run(sql, [username, series],function(err) {
            if (err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
}; //OK


//an user creates a series
exports.newSeries = function(author, title, description, category, id) {
    return new Promise((resolve, reject) => {
        const sql = "insert into series(author,title,description,category,url_img) values(?,?,?,?,?)";

        db.run(sql, [author, title, description, category, id], function(err) {
            if (err) {
                
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
};

//if the user follows the series return true
//else return false
exports.isFollowed = function(username,title) {
    return new Promise((resolve,reject)=>{
        
        const sql = 'select * from followedSeries where user=? and series=?';

        db.get(sql,[username,title],(err,row)=>{
            if(err){
                reject(err);
                return;
            }


            if(row!==undefined) resolve(true);
            else resolve(false);
            
        });
    });
};



