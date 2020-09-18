const Joi = require('@hapi/joi');
import { EnumGenders } from '../../models/account.model'
import { TypesEnum } from '../../models/game.model'
import { LevelsEnum } from '../../models/crossword.model'
const enumGenderAccount = Object.values(EnumGenders)
const enumTypeGame = Object.values(TypesEnum)
const enumLevelCrossword = Object.values(LevelsEnum)
const enumLeaderType = ["general","daily","friends"];
// account
export const jEmail = Joi.string().email();
export const jFullName = Joi.string();
export const jBirthDate = Joi.date();
export const jGender = Joi.string().valid(...enumGenderAccount);
export const jPhone = Joi.string().regex(/^[+]{1}[0-9]{6,20}$/);
export const jFacebookId = Joi.string();

// login
export const jAccessToken = Joi.string();
export const jIdToken = Joi.string();

// game
export const jSolvedDefinitionIds = Joi.array().items(Joi.string()).min(1).unique()
export const jType = Joi.string().valid(...enumTypeGame);
export const jLevel = Joi.string().valid(...enumLevelCrossword);
export const jcrosswordId = Joi.string().min(2);
export const jLeaderType = Joi.string().valid(...enumLeaderType);