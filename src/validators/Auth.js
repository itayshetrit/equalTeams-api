const Joi = require('@hapi/joi');
import * as joiFields from '../middleware/joi-fields';

export const validateRegister = (req, res, next) => {
	// logger.info('Validating request body login');
	const schema = Joi.object().keys(
		{
			name: joiFields.jName.required(),
			phone: joiFields.jName.required(),
			email: joiFields.jEmail.required(),
			password: joiFields.jPassword.required()
		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateLogin = (req, res, next) => {
	logger.info('Validating request body login');
	const schema = Joi.object().keys(
		{
			email: joiFields.jEmail.required(),
			phone: joiFields.jName.required()
		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};
