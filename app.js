const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();

// passport config
require('./config/passport')(passport);

// database
const db = require('./config/database');
try {
	db.authenticate();
	console.log('Connection has been established successfully.');
} catch (error) {
	console.error('Unable to connect to the database:', error);
}

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyparser
app.use(
	express.urlencoded({
		extended: false,
	})
);

// express session
app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	})
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

// routes
app.use('/', require('./routes/web'));

const hostname = '127.0.0.1';
const port = process.env.port || 3000;
app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
});
