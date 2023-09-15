// Contains the routes on the '/api' path
const express = require('express');
const router = express.Router();
const path = require('path');

// TODO
router.get("/", (req, res) => {
    res.json({})
})

module.exports = router;