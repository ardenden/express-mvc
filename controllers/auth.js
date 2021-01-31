const passport = require('passport');

module.exports = {
	// login handle
	login: function (req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/home',
			failureRedirect: '/login',
			failureFlash: true,
		})(req, res, next);
	},

	// logout handle
	logout: function (req, res, next) {
		req.logout();
		req.flash('success_msg', 'You are logged out');
		res.redirect('/login');
	},
};
