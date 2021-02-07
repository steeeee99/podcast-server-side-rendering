'use strict';

//import sqlite
const db = require('../db.js');
const bcrypt = require('bcrypt');

exports.getUserData = function(username) {
    return new Promise((resolve, reject) => {

        const sql = "select url_img,creator from users where username=?";

        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row === undefined) resolve({ error: "Nessun account trovato." });

            resolve(row);
        });
    });
};

exports.updateAccountPhoto = function(username,url){
    return new Promise((resolve,reject)=>{

        const sql = 'update users set url_img = ? where username =?';

        db.run(sql,[url,username],function(err){

            if(err){
                reject(err);
                return;
            }
            resolve(this.lastID);
        });

    });
};


exports.getUserByUsername = function(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                const user = {username: row.username,creator:row.creator}
                resolve(user);
            }
        });
    });
}

exports.getUser = function(username, password) {
        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) 
                    reject(err);
                else if (row === undefined)
                    resolve({error: 'User not found.'});
                else {
                  const user = {username: row.username};
                  let check = false;
                  
                  if(bcrypt.compareSync(password, row.password))
                    check = true;
      
                  resolve({user, check});
                }
            });
        });
}

exports.createUser = function(user) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO users(username,password,creator) VALUES (?,?,?)';
      // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
      bcrypt.hash(user.password, 10).then((hash => {
        db.run(sql, [user.username, hash,user.creator], function(err) {
          if (err) reject(err); 
          else resolve(this.lastID);
        });
      }));
    });
  }
