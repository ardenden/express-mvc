const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			// match user
			User.findOne({ where: { email: email } }).then((user) => {
				if (!user) {
					return done(null, false, {
						message: 'Invalid credentials',
					});
				}
				// match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, {
							message: 'Invalid credentials',
						});
					}
				});
			});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findByPk(id)
			.then((user) => {
				done(null, user);
			})
			.catch((err) => {
				if (err) throw err;
			});
	});
};
