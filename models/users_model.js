//Schema for the users database

//Importing mongoose
const mongoose = require('mongoose');

//Using the Schema function form mongoose module to create a new Schema
const Schema = mongoose.Schema;

//Creating a new Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 6
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
})

//Exporting the Schema and creating a document users to store
module.exports = users_model = mongoose.model('users', userSchema);