// Contains the routes on the '/api' path
const express = require('express');
const router = express.Router();
const User = require('../models/user')

// Creates a new user
router.post("/users", async (req, res) => {
    const username = req.body.username;
    // TODO validation

    // TODO check for duplicate usernames

    const dbUser = await (new User({username: username}).save());
    // TODO try catch

    return res.json({username: dbUser.username, _id: dbUser._id})
})

// Returns all the users in an array
router.get("/users", async (req, res) => {
    // TODO
})

// Adds an exercise based on a user id
router.post("/users/:_id/exercises", async (req, res) => {
    // TODO
})

// Returns a user object with a count of the exercises added, 
// and a log array of all the exercises added
router.get("/users/:_id/logs", async (req, res) => {
    // TODO
})

module.exports = router;