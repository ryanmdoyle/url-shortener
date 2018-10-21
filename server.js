'use strict';

const express = require('express');

// DATABASE Setup
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = "fcc-projects";

const cors = require('cors');

const app = express();

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


//this is for creating the collection
// MongoClient.connect(url, function(err, db) {
//   if (err) console.log(err);
//   console.log("Database created!");
//   // db.createCollection('websites', (err, res) => {
//   //   if (err) console.log(err);
//   //   console.log("Collection created!");
//   //   db.close();
//   // })
//   db.close();
// });

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
  console.log(req.body);
  
  const newSite = req.body.url; //get the url entered into the form field with the name of "url"
  const shortSite = newSite.slice(12, 18);
  const newDbEntry = {original: newSite, short: shortSite};
  
  MongoClient.connect(url, (err, db) => {
    db.collection("websites").insertOne(newDbEntry, (err, res) => {
      if (err) console.log(err);
      console.log("inserted:", newDbEntry, " to database.")
      db.close();
    })
  })
  res.send("entered", newDbEntry)
})

//ROUTE based on entry.
app.get("/api/shorturl/test", (req, res) => {
  
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    findDocuments(db, function() {
      client.close();
    })

    client.close();
  });
  res.send({"status":"working"})
  
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});

const findDocuments = function(db, site, callback) { //modifying to take site as a req param
  // Get the websites collection
  const collection = db.collection('websites');
  
  // Find some documents
  collection.find({"original": req.params.site}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}