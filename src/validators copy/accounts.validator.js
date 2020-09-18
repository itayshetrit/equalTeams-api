const logger = require('../common/logger')(__filename);
const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateUpdateUser = (req, res, next) => {
	logger.info('Validating request body User');
	const schema = Joi.object().keys(
		{
			fullName : joiFields.jFullName,
			email : joiFields.jEmail,
			birthDate: joiFields.jBirthDate,
			gender: joiFields.jGender,
			phone: joiFields.jPhone
		});
	const value = schema.validate(req.body);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateUpdateToken = (req, res, next) => {
	logger.info('Validating request body User');
	
	const schema = Joi.object().keys(
		{
			oneSignalId : joiFields.jAccessToken.required()
		});
	const value = schema.validate(req.body);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};