// Contains the routes on the '/api' path
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Exercise = require('../models/exercise');

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
});

// Returns all the users in an array
router.get("/users", async (req, res) => {
    try{
        const users = await User.find().select('-__v');  // Exclude the __v field
        return res.json(users);
    } catch (err) {
        return res.status(500).json({error: 'Server error'});
    }
});

// Adds an exercise based on a user id
router.post("/users/:_id/exercises", async (req, res) => {
    const {description, duration, date} = req.body;
    const userId = req.params._id;

    // Validate duration in minutes (Integer)
    const parsedDuration = parseInt(duration, 10)
    if (isNaN(parsedDuration)) {
        return res.status(400).json({error: 'Duration should be in minutes (Integer)'})
    };

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({error: 'Date should be in format YYYY-MM-DD'})
    };

    try {
        // Check if user with given _id exists in database
        const user = await User.findOne({_id: userId});
        if (user == null) {
            return res.status(500).json({error: 'User not found'})
        };

        const exercise = await new Exercise({
            username: user._id, 
            description: description, 
            duration: duration, 
            date: parsedDate.toDateString()
        }).save();
        return res.json(exercise);
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Returns a user object with a count of the exercises added, 
// and a log array of all the exercises added
// TODO add from, to, limit GET parameters to retrieve part of the log of the user
// TODO from and to are dates in yyyy-mm-dd format. limit is an integer
router.get("/users/:_id/logs", async (req, res) => {
    const userId = req.params._id;

    try {
        // Check if user with given _id exists in database, also fetch its exercises
        const user = await User.findOne({_id: userId});
        if (user == null) {
            return res.status(500).json({error: 'User not found'})
        };
        const exercises = await Exercise.find({username: user._id});
        
        // Format the response JSON
        const response = {
            username: user.username,
            count: exercises.length,
            _id: user._id,
            log: exercises.map((e) => ({
                description: e.description,
                duration: e.duration,
                date: new Date(e.date).toDateString()
            }))
        }
        return res.json(response)
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Functions
function isValidUsername(username) {
    const regex = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric and underscore, 3-20 characters
    return regex.test(username);
}

module.exports = router;