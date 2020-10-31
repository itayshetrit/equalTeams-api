// var express = require('express');
import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as authController from '../../controllers/auth.controller';
import * as accountsController from '../../controllers/accounts.controller';
import * as authValidators from '../../validators/auth.validator';

router.post('/users/logoutAll', auth, authController.logoutAll);
router.post('/users/login', authValidators.validateLogin, authController.login);
router.get('/users/checkAuth/me', auth, authController.checkAuth);

router.post('/users', auth, authValidators.validateAddUser, accountsController.addUser);
router.patch('/users/:id', auth, authValidators.validateEditUser, accountsController.editUser);
router.delete('/users/:id', auth, accountsController.deleteUser);
router.get('/usersByStadium/:stadium', auth, accountsController.getUsers);


module.exports = router;
