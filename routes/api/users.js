const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator/check')

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/",[
    check('name', 'Name is required').not().isEmpty(),
    check('email','Please Include a valid Email').isEmail(),
    check('password', 'Please Enter password with 6 or more').isLength({ min: 6})
], (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return(res.status(400).json({errors: errors.array()}))
    }
    console.log(req.body);
    res.send('successful post - no errors')
});


module.exports = router;