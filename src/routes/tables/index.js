// var express = require('express');
import express from 'express'
// import express from 'express'
var router = express.Router();
const auth = require('../../middleware/auth');
import * as tablesController from '../../controllers/tables.controller';
import * as tablesValidators from '../../validators/tables.validator';
// import passport from 'passport';

router.post('/tables', tablesValidators.validateLoadTables, tablesController.loadTables);


module.exports = router;
