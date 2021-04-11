//Importing JWT module
const jwt = require('jsonwebtoken');

// Importing BlackList Model
const Blacklist = require('../models/blacklist_model');

//Creating a function to verify the token
async function verifyToken (req,res,next){
    
    const token = req.query.token;
    
    //If token is not present then access will be denied
    if(!token) return res.status(400).json("Access Denied");

    const blackToken = await Blacklist.findOne({ token: token });
    if(blackToken) return res.status(400).json("User has already logged out");

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
    } catch(err) {
      res.status(400).json("Invalid Token");
    }
}

module.exports = verifyToken;