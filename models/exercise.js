const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({ 
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    description: String,
    duration: Number,
    date: String
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise