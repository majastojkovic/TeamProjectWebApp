// jshint esversion:6
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const ejs = require('ejs');


const app = express();

// Passport Config
require('./config/passport')(passport);

//app.use(express.static("public"));
//  app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({
  extended: false
}));

//Load models
const Student = require('./models/Student.js');
const Theme = require('./models/Theme.js');
const Team = require('./models/Team.js');

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({
  extended: false
}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/professor', require('./routes/professor.js'));
app.use('/student', require('./routes/student.js'));
