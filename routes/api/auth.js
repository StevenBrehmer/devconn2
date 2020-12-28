const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

// @route   GET api/auth
// @desc    Signing up a user
// @access  Public
router.get("/", auth, async (req , res) => {
    
    try {
        // can reference req.user anywhere in a protected route.
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// @route   POST api/auth
// @desc    Autheticate User & Get Token
// @access  Public
router.post("/",[
    check('email','Please Include a valid Email').isEmail(),
    check('password', 'Password is required').exists()
], async (req , res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        // 400 error = invalid request
        return(res.status(400).json({errors: errors.array()}))
    }

    const { email, password } = req.body;

    try {
        // See if user exists
        // instead of finding based on email:email  - shorthand is just email
        let user = await User.findOne({email});

        // is user in db
        if(!user)
        {
           return res.status(400).json({errors:[{mgs: 'Invalid Credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // Does the password match for that user
        if(!isMatch){
            return res.status(400).json({errors:[{mgs: 'Invalid Credentials'}]});
        }

        //Create jwt payload
        const payload ={
            user: {
                id:user.id
            }
        };

        // 1hr token
        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            { expiresIn: 360000},
            (err, token) => {
                if (err) throw err;
                res.json({token});
            }
            );
    }catch(err){
        console.error(err.message);
        //500 - internal server error
        res.status(500).send('Server Error');
    }
    
});



module.exports = router;