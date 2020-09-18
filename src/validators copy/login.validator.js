const logger = require('../common/logger')(__filename);
const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateLogin = (req, res, next) => {
	logger.info('Validating login body');
	const schema = Joi.object().keys(
		{
			accessToken : joiFields.jAccessToken.required(),
			idToken : joiFields.jIdToken
		});
	const value = schema.validate(req.body);
	if (value.error) {
		logger.error(value.error.details[0].message);
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};