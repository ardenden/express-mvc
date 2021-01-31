const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = {
	// show users
	index: function (req, res) {
		User.findAll()
			.then((users) => {
				res.render('user/index', {
					users: users,
				});
			})
			.catch((err) => console.log(err));
	},

	// show create user
	create: function (req, res) {
		res.render('user/create');
	},

	// store user
	store: function (req, res) {
		const { name, email, password } = req.body;
		let errors = [];

		// check required fields
		if (!name || !email || !password) {
			errors.push({ msg: 'Please fill in all fields' });
		}

		if (errors.length > 0) {
			res.render('user/create', {
				errors,
				name,
				email,
				password,
			});
		} else {
			// validation passed
			User.findOne({ where: { email: email } }).then((user) => {
				if (user) {
					// user exists
					errors.push({ msg: 'Email is already registered' });
					res.render('user/create', {
						errors,
						name,
						email,
						password,
					});
				} else {
					const newUser = new User({
						name,
						email,
						password,
					});
					// hash password
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							newUser
								.save()
								.then((user) => {
									req.flash('success_msg', 'Created new user');
									res.redirect('/users/create');
								})
								.catch((err) => console.log(err));
						});
					});
				}
			});
		}
	},
};
