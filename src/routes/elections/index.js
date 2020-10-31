import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as electionsController from '../../controllers/elections.controller';
import * as electionsValidators from '../../validators/elections.validator';

router.post('/elections', auth, electionsValidators.validateElections, electionsController.elections);


module.exports = router;
