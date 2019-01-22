'use strict';

const express = require('express');

// DATABASE Setup
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "fcc-projects";
const mongoose = require('mongoose');
const uniqueSlug = require('unique-slug')

const cors = require('cors');

const app = express();

///////////////////////////////////////////
/////////////   MONGO SETUP

const Schema = mongoose.Schema;
const urlSchema = new Schema({
    original_url: String,
    short_url: String,
});

const URL = new mongoose.model('URL', urlSchema);

// Basic Configuration 
let port = process.env.PORT || 3000;

//MIDDLEWARE
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));


app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
  //testing here
  const testObj = {original: "https://www.google.com", short:"goo"}
  MongoClient.connect(url, (err, db) => {
    db.collection("websites").insertOne(testObj, (err, res) => {
      if (err) console.log(err);
      console.log("inserted:", testObj, " to database.")
      db.close();
    })
  })
});


//ADD new db entry  ************** NEEDS TO BE FIXED *****************
app.post("/api/shorturl/new", (req, res) => { //takes website input and shortens it

  res.send({"entered": newDbEntry})
})

//ROUTE based on entry.
app.get("/api/shorturl/:site", (req, res) => {
  
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const query = {"short": req.params.site}
    findDocuments(db, query, function(results) { //this works!  It will return the results of the database entry  --> TODO --> make it reroute instead.  DONE!!!!!!!
      res.redirect(results[0].original);
      client.close();
    })
    client.close()
  });  
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});


//function that takes a query of the req.params and returns the results for a callback to use. (used above)
const findDocuments = function(db, query, callback) { //modifying to take site as a req param
  // Get the websites collection
  const collection = db.collection('websites');
  
  // Find some documents
  collection.find(query).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}