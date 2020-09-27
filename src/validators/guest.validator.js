const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateAddGuest = (req, res, next) => {
	const schema = Joi.object().keys(
		{
			uid: joiFields.jString.required(),
			name: joiFields.jName.required(),
			phone: joiFields.jPhone.required(),
			sum: joiFields.jNumber.required(),
			closeness: joiFields.jString.required()
		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateSetGuestTable = (req, res, next) => {
	console.log('Joi is validating set guest table');
	const schema = Joi.object().keys(
		{
			table: joiFields.jNumber.required(),
			id: joiFields.jString.required()
		});

	const value = schema.validate(req.body);
	if (value.error) {
		console.log(value.error)
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};