const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const pwdCtrl = require('../middleware/password');

router.post('/signup', pwdCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;