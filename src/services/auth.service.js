const bcrypt = require('bcryptjs');
import managerModel from '../models/manager';
import { responseWrapper, responseSuccess } from '../common/respone';

export const checkAuth = async (req) => {
	console.log('checkAuth service');
	try {
		const user = await req.user.getPublicProfile()
		console.log('Success to get user: ')
		console.log(user)
		return responseSuccess(user)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const logoutSpecific = async (req) => {
	console.log('logoutSpecific service');
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
		await req.user.save()
		return responseSuccess()
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const logoutAll = async (req) => {
	console.log('logoutAll service');
	try {
		req.user.tokens = []
		await req.user.save()
		return responseSuccess()
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const login = async (phone, password) => {
	console.log('login service');
	try {
		let user = await managerModel.findOne({ phone })
		if (!user) {
			return responseWrapper(404, { error: "מספר פלאפון לא קיים במערכת" });
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return responseWrapper(401, { error: "סיסמא שגויה" });
		}
		let token = await user.generateAuthAdminToken()
		return responseSuccess({ user: user.getPublicProfile(), token })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const register = async (body) => {
	console.log('register service')
	try {
		const user = new managerModel({ ...body })
		await user.save()
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}