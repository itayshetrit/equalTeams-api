// var express = require('express');
import express from 'express'
// import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as authController from '../../controllers/auth.controller';
import * as accountsController from '../../controllers/accounts.controller';
import * as guestsController from '../../controllers/guests.controller';
import * as accountsValidators from '../../validators/account.validator';
import * as guestsValidators from '../../validators/guest.validator';
import * as authValidators from '../../validators/auth.validator';
// import passport from 'passport';
// router.post('/guests/whatsapp', auth, guestsController.whatsapp);
router.post('/guests', auth, accountsValidators.validateAddGuest, guestsController.addGuest);
router.patch('/guests/setGuestTable', auth, guestsValidators.validateSetGuestTable, guestsController.setGuestTable);
router.patch('/guests/:id', auth, accountsValidators.validateEditGuest, guestsController.editGuest);
router.delete('/guests/:id', auth, guestsController.deleteGuest);
// router.patch('/guests/:id', guestsValidators.validateSetGuestTable, guestsController.setGuestTable);
router.get('/guests', auth, guestsController.getGuests);
router.get('/guests/tables', auth, guestsController.getTablesGuests);
router.post('/users/login', authValidators.validateLogin, authController.login);
router.patch('/guests/setAccept/:id', guestsValidators.validateSetAccept, guestsController.setAccept);
router.get('/users/checkAuth/me', auth, authController.checkAuth);
// router.post('/users/login', authValidators.validateLogin, authController.login);
// router.post('/auth/anonymous', authController.anonymousLogin);
// router.put('/update', accountsValidators.validateUpdateUser, accountsController.updateUser);
// router.get('/userInfo', authController.getUserInfo);
// router.put('/notificationToken', accountsValidators.validateUpdateToken, accountsController.notificationToken);
// router.get('/settings', accountsController.getSettings);

module.exports = router;
