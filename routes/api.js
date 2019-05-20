/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      const query = req.query;
    
     /*  let lookFor = Object.keys(query).reduce(function(obj, k) {
        if (query[k] !== '') obj[k] = query[k];
        return obj;
      }, {});
    
      if (lookFor.open === 'false') lookFor.open = false;
      if (lookFor.open === 'true') lookFor.open = true;
      if (lookFor.hasOwnProperty('_id')) lookFor._id = ObjectId(lookFor._id)
      
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project).find(lookFor).toArray((err, docs) => {
          if (err) console.log(err);
          res.json(docs);
          
          db.close();
        });
      }); */
     var lookFor = Object.keys(req.query).reduce(function(obj, i) {
        if(req.query[i] != ''){
          obj[i] = req.query[i];
        }
        return obj;
      }, {});

      if(lookFor.open == 'false'){
        lookFor.open = false;
      }
      if(lookFor.open == 'true'){
        lookFor.open = true;
      }
      if(lookFor.hasOwnProperty('_id')){
        lookFor._id = ObjectId(lookFor._id);
      }
      
      MongoClient.connect(process.env.DATABASE, function(err, db) {
        db.collection(project).find(lookFor).toArray((err, docs) => {
          if(err){
            res.send(err);
          }
          res.send(docs);
          
          db.close();
        });
      });       
    
    
    /*MongoClient.connect(process.env.DATABASE,(err,db)=>{
      db.collection(project).find({issue_title: "d"},(err,docs)=>{
      res.send(docs)
      console.log(err)
      })
    })*/
    
    
    
    
     })
    
    .post(function (req, res){  
      var project = req.params.project;
/*    console.log(req.body.issue_title);
    console.log(req.body.issue_text);
    console.log(req.body.created_by);
    console.log(req.body.assigned_to);
    console.log(req.body.status_text); */

    if(req.body.assigned_to == undefined){var assigned= ""}else{var assigned= req.body.assigned_to}
    if(req.body.status_text == undefined){var status= ""}else{var status= req.body.status_text}
    
    var newEntry={
    issue_title: req.body.issue_title,
    issue_text: req.body.issue_text,
    created_by: req.body.created_by,
    created_on: new Date(),
    updated_on: new Date(),
    assigned_to: assigned  || "",
    status_text: status || "",      
    open: true
    };
    
    if (req.body.issue_title == undefined || req.body.issue_text == undefined || req.body.created_by == undefined){
      return res.send('missing inputs')
    }

    MongoClient.connect(process.env.DATABASE, function(err,db){
      db.collection(project).insertOne(newEntry, (err,docs)=>{
       if(err){
        res.send(err);
       }
        res.send(docs.ops[0]);

       db.close();
      }); 
    });
    
    
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const _id = req.body._id;
     /*    
      try {
        ObjectId(_id)
      } catch(err) {
        return res.type('text').send('could not update '+_id);
      }*/
    
      //const body = req.body;
      var updatedEntry = Object.keys(req.body).reduce(function(obj, k) {
        if (req.body[k] !== '' && k !== '_id'){ obj[k] = req.body[k];}
        return obj;
      }, {});
    
      if (updatedEntry.open === 'false'){
        updatedEntry.open = false;
      }
      if (updatedEntry.open === 'true'){
        updatedEntry.open = true;
      }
      if(Object.keys(updatedEntry).length > 0){
        updatedEntry.updated_on = new Date();
      }
      MongoClient.connect(process.env.DATABASE, function(err, db) {
        db.collection(project).updateOne({_id: ObjectId(_id)}, {$set: updatedEntry}, (err, docs) => {
          if (err) {
            db.close();
            if (Object.keys(updatedEntry).length == 0) {return res.type('text').send('no updated field sent')}
          }
          
          if (docs.result.n == 0) {
           return res.type('text').send('successfully updated');
          }
          else{ 
           return res.type('text').send('successfully updated');
          }
          
          db.close();
        });
      });      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var _id= req.body._id;
      if(req.body._id == undefined){
        return res.type('text').send('_id error')
      }
    
    MongoClient.connect(process.env.DATABASE, function(err,db){
    db.collection(project).findOneAndDelete({_id: ObjectId(_id)}, function(err,docs){
           if(err){
             
             db.close();
             return res.type('text').send('could not delete ' + _id)
            }                                 
           if(docs.value == null){
             res.type('text').send('deleted ' + _id);
           }
           else{
             res.type('text').send('deleted ' + _id);
           
           }                                 
                                            
             db.close();                               
          });
    
    
    });
      
    });
    
};












