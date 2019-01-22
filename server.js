'use strict';

const express = require('express');

// DATABASE Setup
const assert = require('assert');
const mongoose = require('mongoose');
const uniqueSlug = require('unique-slug')

const cors = require('cors');

const app = express();
mongoose.connect(process.env.SRVADDRESS, {useNewUrlParser: true});

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

app.post('/api/shorturl/new', async (req, res) => {
  const slug = uniqueSlug(req.body.original_url);
  const newSite = await new URL({
    original_url: req.body.original_url,
    short_url: slug
  }).save();
  res.send(newSite);
});

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