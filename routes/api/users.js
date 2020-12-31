const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/",[
    check('name', 'Name is required').not().isEmpty(),
    check('email','Please Include a valid Email').isEmail(),
    check('password', 'Please Enter password with 6 or more').isLength({ min: 6})
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        // 400 error = invalid request
        return(res.status(400).json({errors: errors.array()}))
    }

    const { name, email, password } = req.body;

    try {
        // See if user exists
        // instead of finding based on email:email  - shorthand is just email
        let user = await User.findOne({email});

        if(user)
        {
           return res.status(400).json({errors:[{msg: 'user already registed in db'}]});
        }

        // Get users Gravatar
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name, 
            email,
            avatar, 
            password
        });

        // encrypt password (bcrypt)
        // create salt to do hashing with
        // 10 is recomended rounds in documentation ( more you have more secure - but slowerrrr)
        const salt = await bcrypt.genSalt(10);

        // with salt, we have to hash password        
        user.password = await bcrypt.hash(password, salt);

        // anything that returns a promise use await.
        // without this being async we would use a lot of .then
        //save user to db
        await user.save();

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