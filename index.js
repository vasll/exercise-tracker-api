const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes/api');
const frontendRoutes = require('./routes/frontend');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config()

// Express app
const app = express()

// Set up middleware
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set up project routes
app.use('/api', apiRoutes)
app.use('/', frontendRoutes)

// Connect to mongodb database
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})