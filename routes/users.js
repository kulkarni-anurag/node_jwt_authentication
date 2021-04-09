const express = require('express');
const router = express.Router();
const Users = require('../models/users_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('../tokens/loginToken');

router.get('/', verify, async(req,res) => {
  Users.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: "+err));
})

router.post('/register', async(req,res) => {
  const user = await Users.findOne({ email: req.body.email });
  
  if(user) return res.status(400).json("Email Already Exists!");
  
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  
  const addUser = new Users({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  
  addUser.save()
    .then(() => res.json('User Registered'))
    .catch((err) => res.status(400).json('Error'+ err));
})

router.post('/login', async(req,res) => {
  const user = await Users.findOne({ email: req.body.email });
  
  if(!user) return res.status(400).json("Account not present");
  
  const auth = await bcrypt.compare(req.body.password, user.password);
  
  if(!auth) return res.status(400).json("Wrong Password");
  
  const sessionDetails = {
    id: user._id,
    name: user.name
  }
  
  const token = jwt.sign(sessionDetails, process.env.SECRET_KEY);
  
  res.header("login-token", token).json("Login Successful!");
  
})

router.delete("/:id", (req, res) => {
  Users.findByIdAndDelete(req.params.id)
    .then(() => res.json("User Account Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;