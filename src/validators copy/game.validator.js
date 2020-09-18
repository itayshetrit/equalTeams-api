const logger = require('../common/logger')(__filename);
const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateSolvedDefinitionIds = (req, res, next) => {
	logger.info('Validating ids array');
	const schema = Joi.object().keys(
		{
			solvedDefinitionIds: joiFields.jSolvedDefinitionIds
		});
	const value = schema.validate(req.body);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};


export const validateLeaderType = (req, res, next) => {
	logger.info('Validating crossword type');
	const schema = Joi.object().keys(
		{
			type: joiFields.jLeaderType
		});
	const value = schema.validate(req.query);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateCrosswordType = (req, res, next) => {
	logger.info('Validating crossword type');
	const schema = Joi.object().keys(
		{
			type: joiFields.jType,
			level: joiFields.jLevel
		});
	const value = schema.validate(req.query);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateCrosswordId = (req, res, next) => {

	logger.info('Validating crossword id');
	const schema = Joi.object().keys(
		{
			id: joiFields.jcrosswordId
		});
	const value = schema.validate(req.params);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};