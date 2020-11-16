const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields';


export const validateAddUser = (req, res, next) => {
	console.log('Joi is validating add user');
	const schema = Joi.object().keys(
		{
			fname: joiFields.jName.required(),
			lname: joiFields.jName.required(),
			phone: joiFields.jPhone,
			attack: joiFields.jNumber.required(),
			defense: joiFields.jNumber.required(),
			team: joiFields.jString.required()
		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		console.log("errorrrrr");
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};

export const validateEditUser = (req, res, next) => {
	console.log('Joi is validating edit user');
	const schema = Joi.object().keys(
		{
			fname: joiFields.jName.required(),
			lname: joiFields.jName.required(),
			phone: joiFields.jPhone.required(),
			attack: joiFields.jNumber.required(),
			defense: joiFields.jNumber.required(),
			laundry: joiFields.jNumber.required()

		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};