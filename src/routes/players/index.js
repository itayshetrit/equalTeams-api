import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as guestsController from '../../controllers/guests.controller';
import * as accountsValidators from '../../validators/account.validator';
import * as guestsValidators from '../../validators/guest.validator';
router.post('/guests', auth, guestsValidators.validateAddGuest, guestsController.addGuest);
router.patch('/guests/setGuestTable', auth, guestsValidators.validateSetGuestTable, guestsController.setGuestTable);
router.patch('/guests/:id', auth, guestsValidators.validateEditGuest, guestsController.editGuest);
router.delete('/guests/:id', auth, guestsController.deleteGuest);
router.get('/guests', auth, guestsController.getGuests);
router.get('/guests/tables', auth, guestsController.getTablesGuests);
router.patch('/guests/setAccept/:id', guestsValidators.validateSetAccept, guestsController.setAccept);

module.exports = router;
