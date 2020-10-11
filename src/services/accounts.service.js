const uuid = require('uuid');
import axios from 'axios'
import accountModel from '../models/user'
import guestModel from '../models/guest'
// return uuid();
import { responseWrapper, responseSuccess } from '../common/respone';

const getJwtAndIdToken = (uid, id_token) => {
	const token = signJwtWithExp({ uid: uid }, '30d');
	console.log('User access token created');
	return ({ jwt: token, id_token: id_token })
}

export const addUser = async (req) => {
    try {
		const user = new accountModel({ ...req.body })
		await user.save()
		return responseSuccess({ok:1})
    } catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
    }
}

export const getUsers = async (req) => {
	
	console.log('get users service');
    try {
		const users = await accountModel.find({ role: 1 }).select(['name', '_id'])
		return responseSuccess(users)
    } catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
    }
}