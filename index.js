const express = require('express')
const cors = require('cors')
const apiRoutes = require('./routes/api');
const { inspect } = require('util');
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

// Set up custom middleware
const loggerMiddleware = (req, res, next) => {
	console.log(
	`[REQUEST] ${req.method} ${req.url} FROM ${req.ip}\n` +
	` req.body: ${inspect(req.body)}\n` +
	` req.params: ${inspect(req.params)}\n` +
	` req.query: ${inspect(req.query)}` 
	);

  	const originalSend = res.send;
	res.send = function (data) {
		console.log(`[RESPONSE] ${req.method} ${req.url}\n ${data}`);
		originalSend.apply(res, arguments);
	};
	next();
};

app.use("/api/", loggerMiddleware)

// Set up project routes
app.use('/api', apiRoutes)
app.use('/', frontendRoutes)

// Connect to mongodb database
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
