const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require('../../models/Profile');
const {check, validationResult} = require('express-validator');

const profile = require('../../models/Profile');
//const user = require('../../models/User');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me",auth, async (req , res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name','avatar']);

        if(!profile){
            return res.status(400).json({msg: "There is no profile for this user"});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/profile/
// @desc    Create or Update User Profile
// @access  Private
router.post('/', [ auth, [
    check('status' , 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], 
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {
        company, 
        website, 
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if(company) profileFields.company = company; 
    if(website) profileFields.website = website; 
    if(location) profileFields.location = location; 
    if(bio) profileFields.bio = bio; 
    if(status) profileFields.status = status; 
    if(githubusername) profileFields.githubusername = githubusername; 
    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    
    // Build social Object
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube; 
    if(facebook) profileFields.social.facebook = facebook; 
    if(twitter) profileFields.social.twitter = twitter; 
    if(instagram) profileFields.social.instagram = instagram; 
    if(linkedin) profileFields.social.linkedin = linkedin; 

    try {
        let profile = await Profile.findOne({user: req.user.id});

        // update the profile if found
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id}, 
                {$set: profileFields}, 
                {new: true}
            );
            return res.json(profile);
        }

        // create new profile
        profile = new Profile( profileFields);
        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/
// @desc    Get All Profiles
// @access  public
router.get('/', async (req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   GET api/profile/user/:user_id
// @desc    Get profile of specific user
// @access  Public

router.get('/user/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);

        if(!profile) return res.status(400).json({"msg": "Profile Not Found"});

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') return res.status(400).json({"msg": "Profile Not Found"});
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/
// @desc    Delete Profile, user, and posts
// @access  Private
router.delete('/', auth ,  async (req,res) => {
    try {
        // Remove Profile
        // @todo - remove users posts
        await Profile.findOneAndRemove({user: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        
        res.json({msg: 'User Removed'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id',auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        // Get the Remove Index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        // splice will take something out
        profile.experience.splice(removeIndex,1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Issue');
    }
});


// @route   PUT api/profile/experience
// @desc    Add profile Experience
// @access  Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
] ], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //destructure 
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        //unshift pushes to array at the begining instead of the end
        profile.experience.unshift(newExp);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

// @todo - change for edu
// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('from', 'From Date is required').not().isEmpty(),
] ], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //destructure 
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({user: req.user.id});
        //unshift pushes to array at the begining instead of the end
        profile.education.unshift(newEdu);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

// @route   DELETE api/profile/education/:exp_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id',auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        // Get the Remove Index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        // splice will take something out
        profile.education.splice(removeIndex,1);

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Issue');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  public
router.get('/github/:username',(req, res)=> {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }
        request(options,(error,response,body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
                return res.status(404).json({msg: 'No Github Profile Found'});
            }

            res.json(JSON.parse(body));
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;