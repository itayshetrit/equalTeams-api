const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const addTeam = (req, res, next) => {
	console.log('Joi is validating add team');
	const schema = Joi.object().keys(
		{
			team: joiFields.jName.required()
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};
