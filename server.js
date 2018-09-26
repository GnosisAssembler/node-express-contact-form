// Require dependencies
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Init App
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'assets')));

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// BodyParser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Bring in routes 
const contact = require('./routes/contact');
// Use Routes
app.use('/', contact);

//Listen to port 3000 for connection
app.listen(3000 , function() {
  console.log('Server running on port 3000...');
});
