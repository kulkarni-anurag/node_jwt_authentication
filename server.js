const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const conn = mongoose.connection;

conn.once('open', () => {
  console.log('MongoDB connection established');
})

app.get('/', (req,res) => {
  res.send("Welcome to Node JWT Authentication App!");
})

const userRouter = require('./routes/users');
app.use('/auth', userRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})