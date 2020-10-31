// var express = require('express');
import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
const allowed = require('../../middleware/allowed');
import * as authController from '../../controllers/auth.controller';
import * as authValidators from '../../validators/auth.validator';

router.post('/auth/register', authValidators.validateRegister, authController.logoutSpecific);
router.post('/auth/logoutSpecific', auth, authController.logoutSpecific);
router.post('/auth/logoutAll', auth, authController.logoutAll);
router.post('/auth/login', authValidators.validateLogin, authController.login);
router.get('/auth/checkAuth', auth, authController.checkAuth);

module.exports = router;
