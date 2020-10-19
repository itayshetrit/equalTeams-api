const Joi = require('@hapi/joi');
import * as joiFields from './joi-fields'

export const validateElections = (req, res, next) => {
	const schema = Joi.object().keys(
		{
			numOfTeams: joiFields.jNumber.required(),
			list: joiFields.jArray.required()
		
		});

	const value = schema.validate(req.body);
	if (value.error) {
		res.status(400).send({ error: value.error.details[0].message });
		return;
	}
	next();
};
