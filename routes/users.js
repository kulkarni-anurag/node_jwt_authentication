// Importing Express Modules
const express = require('express');
const router = express.Router();

// Importing User model
const Users = require('../models/users_model');

// Importing BlackList Model
const Blacklist = require('../models/blacklist_model'); 

// Importing Encryption Modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importing Verifation Models
const verify = require('../tokens/loginToken');

// Returns all Users
router.get('/', verify, async(req,res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: "+err));
})

// Route to create a new account
router.post('/register', async(req,res) => {
  //Firstly, we will check if the email which client has entered is in the database or not
  const user = await Users.findOne({ email: req.body.email });
  
  //If email exists in the database then client won't be able to create an account with same email
  if(user) return res.status(400).json("Email Already Exists!");
  
  //Generating salt to encrypt the password
  const salt = await bcrypt.genSalt(10);
  
  //Encrypting the password using the generated salt
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  
  //Creating a new User Record
  const addUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  
  //Saving the User into the database
  addUser.save()
    .then(() => res.json('User Registered'))
    .catch((err) => res.status(400).json('Error'+ err));
})

// Route for the client to login
router.post('/login', async(req,res) => {
  //Firstly, we will check if the email which client has entered is in the database or not
  const user = await Users.findOne({ email: req.body.email });
  
  //If email doesn't exist in the database then further executing will be halted
  if(!user) return res.status(400).json("Account not present");
  
  //Password entered by the user and the one present in the database will be compared
  const auth = await bcrypt.compare(req.body.password, user.password);
  
  //If passwords do not match you will get an error
  if(!auth) return res.status(400).json("Wrong Password");
  
  //Variable to store session details
  const sessionDetails = {
    id: user._id,
    name: user.name
  }
  
  //Creating a jwt token to store the session details
  const token = jwt.sign(sessionDetails, process.env.SECRET_KEY, { expiresIn: '30m' });
  
  //Sending the token to the client side
  res.header("login-token", token).json("Login Successful!");
  
})

// Route for user to logout
router.post('/logout', async(req, res) => {
  const newToken = new Blacklist({
    token: req.body.token
  })
  newToken.save()
    .then(() => res.json("Logout Successful!"))
    .catch((err) => res.status(400).json("Error: "+err));
})

// Route to delete an user account
router.delete("/:id", (req, res) => {
  Users.findByIdAndDelete(req.params.id)
    .then(() => res.json("User Account Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;