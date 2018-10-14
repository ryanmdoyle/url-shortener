const mongo = require("mongodb");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  originalURL: {type: String, required: true},
  shortURL: String
})

