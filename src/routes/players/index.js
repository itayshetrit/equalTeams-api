import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as accountsController from '../../controllers/accounts.controller';
import * as accountsValidators from '../../validators/account.validator';
import * as guestsValidators from '../../validators/guest.validator';

router.get('/players/usersByTeam/:team', auth, accountsController.getUsers);
router.delete('/players/:id', auth, accountsController.deleteUser);

module.exports = router;
