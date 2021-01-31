const passport = require('passport');

module.exports = {
	// show home page
	index: function (req, res) {
		res.render('home', {
			name: req.user.name,
		});
	},
};
