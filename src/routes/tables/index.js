import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
const allowed = require('../../middleware/allowed');
import * as tablesController from '../../controllers/tables.controller';
import * as tablesValidators from '../../validators/tables.validator';

router.post('/tables', allowed, tablesValidators.validateLoadTables, tablesController.loadTables);
router.get('/tables', auth, tablesController.getTables);


module.exports = router;
