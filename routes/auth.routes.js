const express = require('express');
const { check } = require('express-validator');
const AuthController = require('../controller/auth.controller');
const router = new express();

router.post(
  '/registration',
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({
      min: 3,
      max: 12,
    }),
  ],
  AuthController.registration_post,
);

router.post('/login', AuthController.login_post);

module.exports = router;
