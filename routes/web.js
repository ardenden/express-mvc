const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const auth = require('../controllers/auth');
const home = require('../controllers/home');
const user = require('../controllers/user');

// welcome page
router.get('/', (req, res) => res.render('auth/login', { layout: false }));

// auth
router.get('/login', (req, res) => res.render('auth/login', { layout: false }));
router.post('/login', auth.login);
router.get('/logout', auth.logout);

// home page
router.get('/home', ensureAuthenticated, home.index);

// users
router.get('/users', ensureAuthenticated, user.index);
router.get('/users/create', ensureAuthenticated, user.create);
router.post(
	'/users/create',
	ensureAuthenticated,
	user.storeValidate,
	user.store
);

module.exports = router;
