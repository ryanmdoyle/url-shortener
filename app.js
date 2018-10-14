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

export function addShortURL(original, done) {
  const shortened = original.slice(0, 5);
  
  const site = new Site({originalURL: original, shortURL: shortened})
  
  site.save(function(err, data) {
    if (err) return(err, data);
    return done(null, data)
  })
}

