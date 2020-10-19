import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
const allowed = require('../../middleware/allowed');
import * as electionsController from '../../controllers/elections.controller';
import * as electionsValidators from '../../validators/elections.validator';

router.post('/elections', allowed, electionsValidators.validateElections, electionsController.elections);


module.exports = router;
