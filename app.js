const mongo = require("mongodb");
const mongoose = require("mongoose");

//create schema for db structure
const schema = new mongoose.Schema({
  originalURL: {type: String, required: true},
  shortURL: String
})


// use the schema to make a Site object to update/use
const Site = mongoose.model("Site", schema)

//function to update the db with new website

const addShortURL = function(original, done) {
  
}