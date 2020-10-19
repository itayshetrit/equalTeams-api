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

export const addUser = async (body, uid) => {
	console.log('add user service')
	try {
		const user = new accountModel({ ...body, uid })
		await user.save()
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getUsers = async (stadium) => {
	console.log('get users service');
	try {
		const users = await accountModel.find({ role: 1, stadium }).select(['-password', '-tokens'])
		return responseSuccess(users)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const editUser = async (body, id) => {

	console.log('edit user service');
	try {
		const user = await accountModel.updateOne({ _id: id }, { ...body })
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const deleteUser = async (id) => {
	console.log('delete user service');
	try {
		const user = await accountModel.findByIdAndDelete(id)
		return responseSuccess({ ok: 1 });
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}
