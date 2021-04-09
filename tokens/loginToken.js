//Importing JWT module
const jwt = require('jsonwebtoken');

//Creating a function to verify the token
function verifyToken (req,res,next){
    
    const token = req.query.token;
    
    //If token is not present then access will be denied
    if(!token) return res.status(400).json("Access Denied");

    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
    } catch(err) {
      res.status(400).json("Invalid Token");
    }
}

module.exports = verifyToken;