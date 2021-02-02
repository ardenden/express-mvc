const passport = require('passport');

module.exports = {
	// login
	login: function (req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/home',
			failureRedirect: '/login',
			failureFlash: true,
		})(req, res, next);
	},

	// logout
	logout: function (req, res, next) {
		req.logout();
		res.redirect('/login');
	},
};
