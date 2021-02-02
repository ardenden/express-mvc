const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

module.exports = {
	// list page
	index: function (req, res) {
		User.findAll()
			.then((users) => {
				res.render('user/index', {
					users: users,
				});
			})
			.catch((err) => console.log(err));
	},

	// create page
	create: function (req, res) {
		res.render('user/create');
	},

	// create
	storeValidate: [
		check('name').isLength({ min: 1 }).withMessage('please enter full name'),
		check('email').isEmail().withMessage('please enter a valid email address'),
		check('password')
			.isLength({ min: 6 })
			.withMessage('password must be at least 6 characters'),
		(req, res, next) => {
			const { name, email, password } = req.body;
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.render('user/create', {
					errors: errors.array(),
					name,
					email,
					password,
				});
			} else {
				User.findOne({ where: { email: email } }).then((user) => {
					if (user) {
						res.render('user/create', {
							error_msg: 'Email address already registered',
							name,
							email,
							password,
						});
					} else {
						next();
					}
				});
			}
		},
	],
	store: function (req, res) {
		const { name, email, password } = req.body;
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
	},
};
