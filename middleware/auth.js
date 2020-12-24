const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware functions are just functions that have access to request and response 
// while next provides 
module.exports = function(req, res, next){
    //  Get Token from Header
    const token = req.header('x-auth-token');

    // check if ther is no token
    if(!token){
        // 401 error - un authorized client
        return res.status(401).json({msg:"No Token - Authorization Denied"});
    }

    // Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;

        next();

    } catch (error) {
        // runs when token not valid
        res.status(401).json({msg: "Token is not Valid"});
    }


}