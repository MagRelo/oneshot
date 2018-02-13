const express = require('express')
const app = express()

// Express middleware
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

// var config = require('./config/environment');

// Connect to database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoConfig = {
  uri: process.env.MONGODB_URL_INT || 'mongodb://127.0.0.1:27017/oneshotpage'
}
mongoose.connect(mongoConfig.uri, mongoConfig.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '1mb'}));
app.use(methodOverride());
app.use(helmet());
app.use(cookieParser());
app.use(morgan('dev', {
  skip: function (req, res) {
    // remove the frontend dev server's 'json' calls from the console output
    return req.originalUrl.indexOf('json') > 0
  }
}));

// API ROUTING
require('./routes')(app);

var server = app.listen(8080, function () {
  console.log('App running on port 8080')
})
