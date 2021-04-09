//Importing the express module for the framework
const express = require('express');

//Importing mongoose to connect to Atlas database
const mongoose = require('mongoose');

//Importing CORS for cross server interraction
const cors = require('cors');

//Importing the dotenv module to store values in environment
require('dotenv').config();

const app = express();

//Accessing the port value from the environment variable or it will be 5000
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Establishing connection to the database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const conn = mongoose.connection;

//If connection is established following message will be shown in the console
conn.once('open', () => {
  console.log('MongoDB connection established');
})

//Response
app.get('/', (req,res) => {
  res.send("Welcome to Node JWT Authentication App!");
})

//Using the User Route
const userRouter = require('./routes/users');
app.use('/auth', userRouter);

//Seeting up the server port listening
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})