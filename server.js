'use strict';

var express = require('express');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

const url = process.env.MONGO_URI;

MongoClient.connect(url, function(err, db) {
  if (err) console.log(err);
  console.log("Database created!");
  // db.createCollection('websites', (err, res) => {
  //   if (err) console.log(err);
  //   console.log("Collection created!");
  //   db.close();
  // })
});

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
    db.collection("websites", 
  })
});

//create a post here, where the connection is opened (https://www.w3schools.com/nodejs/nodejs_mongodb_createcollection.asp) and edited

app.listen(port, function () {
  console.log('Node.js listening ...');
});