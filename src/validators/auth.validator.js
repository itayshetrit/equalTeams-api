const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateRegister = (req, res, next) => {
	console.log('Joi is validating register');
	const schema = Joi.object().keys(
		{
			name: joiFields.jName.required(),
			phone: joiFields.jPhone.required(),
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
	console.log('Joi is validating login');
	const schema = Joi.object().keys(
		{
			phone: joiFields.jPhone.required(),
			password: joiFields.jPassword.required()

		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};
