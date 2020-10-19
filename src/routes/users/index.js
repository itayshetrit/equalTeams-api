// var express = require('express');
import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
const allowed = require('../../middleware/allowed');
import * as authController from '../../controllers/auth.controller';
import * as accountsController from '../../controllers/accounts.controller';
import * as authValidators from '../../validators/auth.validator';

router.post('/users/logoutAll', auth, authController.logoutAll);
router.post('/users/login', authValidators.validateLogin, authController.login);
router.get('/users/checkAuth/me', auth, authController.checkAuth);

router.post('/users/', allowed, authValidators.validateAddUser, accountsController.addUser);
router.patch('/users/:id', allowed, authValidators.validateEditUser, accountsController.editUser);
router.delete('/users/:id', allowed, accountsController.deleteUser);
router.get('/usersByStadium/:stadium', allowed, accountsController.getUsers);


module.exports = router;
