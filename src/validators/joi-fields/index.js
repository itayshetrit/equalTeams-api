const Joi = require('@hapi/joi');


// auth
export const jName = Joi.string().regex(/^[a-zא-תA-Z ]{2,20}$/);
export const jPhone = Joi.string().regex(/^0?[5]{1}[0-9]{8}$/);
// export const jEmail = Joi.string().email();
export const jPassword = Joi.string().min(6);
export const jString = Joi.string();
export const jNumber = Joi.number();
