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

app.get("/api/shorturl/:site", (req, res) => {
  const queryResults = [];
  if (req.params.site === "test") {
    MongoClient.connect(url, async (err, client) => {
      const db = client.db("websites");
      const cursor = db.collection("websites").find();
      cursor.forEach(await function(doc, err) {
        queryResults.push(doc);
      })
      
      function respond() {
        res.send({"hi": queryResults});
        client.close();
      }
    })
      
  }
    
  }
)


app.listen(port, function () {
  console.log('Node.js listening ...');
});