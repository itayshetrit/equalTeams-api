const uuid = require('uuid');
import axios from 'axios'
import playerModel from '../models/players'
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
		const isExist = await playerModel.findOne({ fname: body.fname, lname: body.lname, team: body.team, uid });
		if (isExist) {
			return responseWrapper(409, { error: "שחקן זה כבר קיים בקבוצה זו" });
		}
		const user = new playerModel({ ...body, uid })
		await user.save()
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getUsers = async (team) => {
	console.log('get users service');
	try {
		const users = await playerModel.find({ team }).select(['-password', '-tokens'])
		return responseSuccess(users)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const editUser = async (body, id) => {

	console.log('edit user service');
	try {
		const user = await playerModel.updateOne({ _id: id }, { ...body })
		return responseSuccess({ ok: 1 })
	} catch (err) {
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const deleteUser = async (id) => {
	console.log('delete user service');
	try {
		const user = await playerModel.findByIdAndDelete(id)
		return responseSuccess({ ok: 1 });
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}
