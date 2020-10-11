// import axios from 'axios';
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
import accountModel from '../models/user';
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

export const logoutAll = async (req) => {
	console.log('logoutAll service');


	try {
        req.user.tokens = []
        await req.user.save()
        return responseSuccess()
    } catch (err) {
        return responseWrapper(500, { error: "Internal Server Error" });
    }
	
}
// const generateAuthAdminToken = async (user) => {
// 	const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_ADMIN)
//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }

// const generateAuthToken = async (user) => {
// 	const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }

export const login = async (phone, password) => {
	console.log('login service');
	try {
		let user = await accountModel.findOne({phone})
		if(!user){
			return responseWrapper(404, { error: "מספר פלאפון לא קיים במערכת" });
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if(!isMatch){
			return responseWrapper(401, { error: "סיסמא שגויה" });
		}
		let token;
        if (user.role == 2) {
            token = await user.generateAuthAdminToken()
		}
		else {
            token = await user.generateAuthToken()
        }
		return responseSuccess({ user: user.getPublicProfile(), token })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}