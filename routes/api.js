// Contains the routes on the '/api' path
const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Exercise = require('../models/exercise')

// Creates a new user
router.post("/users", async (req, res) => {
    // Username validation
    const username = req.body.username;
    if (!isValidUsername(username)) {
        return res.status(400).json({ error: 'Invalid username' });
    }

    // Check if username is already in db, if it does return that user instance, otherwise make a new one
    try{
        var user = await User.findOne({username: username});
        if (user == null) {
            user = await new User({username: username}).save()
        };
        return res.json({username: user.username, _id: user._id});
    } catch(err) {
        return res.status(500).json({error: 'Server error'});
    }
})

// Returns all the users in an array
router.get("/users", async (req, res) => {
    try{
        const users = await User.find().select('-__v');  // Exclude the __v field
        return res.json(users);
    } catch (err) {
        return res.status(500).json({error: 'Server error'});
    }
})

// Adds an exercise based on a user id
router.post("/users/:_id/exercises", async (req, res) => {
    const {description, duration, date} = req.body;
    const userId = req.params._id;

    // TODO validate duration
    // TODO validate date

    try {
        // Check if user with given _id exists in database
        const user = await User.findOne({_id: userId});
        if (user == null) {
            return res.status(500).json({error: 'User not found'})
        };

        const exercise = await new Exercise({
            username: user._id, description, duration, date
        }).save();
        return res.json(exercise);
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
})

// Returns a user object with a count of the exercises added, 
// and a log array of all the exercises added
router.get("/users/:_id/logs", async (req, res) => {
    // TODO
})

// Functions
function isValidUsername(username) {
    const regex = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric and underscore, 3-20 characters
    return regex.test(username);
}

module.exports = router;