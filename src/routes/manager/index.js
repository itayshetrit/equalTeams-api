// var express = require('express');
import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as managerController from '../../controllers/manager.controller';
import * as accountsController from '../../controllers/accounts.controller';
import * as authValidators from '../../validators/auth.validator';
import * as managerValidators from '../../validators/manager.validator';

router.patch('/manager/addTeam', auth, managerValidators.addTeam, managerController.addTeam);

// router.post('/users', auth, authValidators.validateAddUser, accountsController.addUser);
// router.patch('/users/:id', auth, authValidators.validateEditUser, accountsController.editUser);




module.exports = router;
