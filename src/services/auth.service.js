// import axios from 'axios';
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
import accountModel from '../models/user';
import { responseWrapper, responseSuccess } from '../common/respone';

export const checkAuth = async (req) => {
	console.log('checkAuth service');
	try {
		const user = await req.user.getPublicProfile()
		console.log(user)
		console.log('Success to get user: ' + JSON.stringify(user))
		return responseSuccess(user)
	} catch (err) {
		console.log(err.stack)
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
// const getJwtAndIdToken = (uid, id_token) => {
// 	const token = signJwtWithExp({ uid: uid }, '30d');
// 	console.log('User access token created');
// 	return ({ jwt: token, id_token: id_token })
// }

// const createAccountStatistics = async (uid) => {
// 	console.log('Create statistics for user with id: ' + uid);
// 	try {
// 		const statistics = new accountStatisticsModel({ userId: uid })
// 		await statistics.save()
// 		console.log('Success to create statistics: ' + statistics)
// 		return responseSuccess({ ok: 1 })
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// const createAccountSettings = async (uid) => {
// 	console.log('Create settings for user with id: ' + uid);
// 	try {
// 		const settings = new accountSettingsModel({ userId: uid })
// 		await settings.save()
// 		console.log('Success to create settings: ' + settings)
// 		return responseSuccess({ ok: 1 })
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// const createNewGuestAccount = async () => {
// 	console.log('Create new anonymous user');
// 	let user = 1;
// 	let number = 1;
// 	try {
// 		while (user !== null) {
// 			number = Math.floor(Math.random() * 1000000);
// 			user = await getUserByFullName("User" + number)
// 		}
// 		const { data, status, error } = await createAccount({
// 			idToken: generateUUID(),
// 			fullName: "User" + number
// 		})
// 		console.log('Success to create anonymous user');
// 		return data;
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }


// const updateUserPrepare = async (data, id) => {
// 	console.log('Update user preparetion');
// 	try {
// 		await updateUser({
// 			fullName: data.name,
// 			email: data.email,
// 			gender: data.gender,
// 			birthDate: data.birthday,
// 			facebookId: data.id,
// 			loginType: "facebook"
// 		}, id)

// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }


// const createNewFacebookAccount = async (data) => {
// 	console.log('Create new facebook user');
// 	try {
// 		const user = await createAccount({
// 			idToken: generateUUID(),
// 			fullName: data.name,
// 			birthDate: data.birthday,
// 			gender: data.gender,
// 			email: data.email,
// 			facebookId: data.id,
// 			loginType: 'facebook'
// 		})
// 		return user;
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const anonymousLogin = async (idToken) => {
// 	console.log('Anonymous login service');
// 	try {
// 		let user;
// 		if (idToken) {
// 			console.log('Find after exist user with idToken: ' + idToken);
// 			user = await getUserByIdToken(idToken)
// 			if (user) {
// 				console.log('User is allready exist at DB ')
// 			}
// 			else {
// 				user = await createNewGuestAccount()
// 			}
// 		}
// 		else {
// 			user = await createNewGuestAccount()
// 		}
// 		return responseSuccess(getJwtAndIdToken(user._id, user.idToken));
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }


// export const facebookLogin = async (accessToken, idToken) => {
// 	console.log('Fetching user by access token')
// 	try {
// 		const userFieldSet = 'id, name, email, gender, birthday';
// 		const { data, status, error } = await axios.get(env.facebookApi + 'me?fields=' + userFieldSet + '&access_token=' + accessToken)
// 		if (status === 200) {
// 			console.log("User's facebook profile was found: " + JSON.stringify(data))
// 			let user = await getUserByFacebookId(data.id)
// 			if (user) {
// 				console.log('User is allready exist at DB ' + JSON.stringify(data))
// 				await updateUserPrepare(data, user._id)
// 			}
// 			else {
// 				if (idToken) {
// 					user = await getUserByIdToken(idToken)
// 					if (user) {
// 						await updateUserPrepare(data, user._id)
// 					}
// 					else {
// 						user = await createNewFacebookAccount(data)
// 					}
// 				}
// 				else {
// 					console.log("No id token was sent")
// 					user = await createNewFacebookAccount(data)
// 				}
// 			}
// 			if (user.status === 500) {
// 				return responseWrapper(user.status, { error: user.data.error });
// 			}
// 			else if (user.status === 200) {
// 				user = user.data;
// 			}
// 			const token = signJwtWithExp({ uid: user._id }, '30d');
// 			console.log('User access token created');
// 			return responseSuccess({ jwt: token, id_token: user.idToken });
// 		}

// 	} catch (err) {
// 		if (err.response.status !== 500) {
// 			console.log(err.response.data.error.message)
// 			return responseWrapper(err.response.status, { error: err.response.data.error.message });
// 		}
// 		console.log(err.stack)
// 	}
// 	return responseWrapper(500, { error: "Failed authentication" });
// }

// export const updateUser = async (data, id) => {
// 	console.log('Update user with id: ' + id + 'with this new data: ' + JSON.stringify(data))
// 	try {
// 		const user = await accountModel.updateOne({ _id: id }, { $set: { ...data } })
// 		if (user.n === 0) {
// 			console.log('user with id: ' + id + ' was not found')
// 			return responseWrapper(404, { error: 'user with id: ' + id + ' was not found' });
// 		}
// 		if (user.nModified === 0) {
// 			console.log('User with id:  ' + id + ' is up to date')
// 		}
// 		else {
// 			console.log('update ' + id + ' success')
// 		}
// 		return responseSuccess({ ok: 1 })
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const getUserByFacebookId = async (facebookId) => {
// 	console.log('Try to find user with facebook id: ' + facebookId)
// 	try {
// 		const user = await accountModel.findOne({ facebookId: facebookId })
// 		if (!user) {
// 			console.log('User with facebook id: ' + facebookId + ' was not found')
// 			return null;
// 		}
// 		console.log('User with facebook id: ' + facebookId + ' found: ' + user)
// 		return user
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const getUserByIdToken = async (idToken) => {
// 	console.log('Try to find user with idToken: ' + idToken)
// 	try {
// 		const user = await accountModel.findOne({ idToken: idToken })
// 		if (!user) {
// 			console.log('User with idToken: ' + idToken + ' was not found')
// 			return null;
// 		}
// 		console.log('User with idToken: ' + idToken + ' found: ' + user)
// 		return user
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const getUserByFullName = async (fullName) => {
// 	console.log('Try to find user with fullName: ' + fullName)
// 	try {
// 		const user = await accountModel.findOne({ fullName: fullName })
// 		if (!user) {
// 			console.log('User with fullName: ' + fullName + ' was not found')
// 			return null;
// 		}
// 		console.log('User with fullName: ' + fullName + ' found: ' + user)
// 		return user
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const createAccount = async (data) => {
// 	console.log('Create user with this data: ' + JSON.stringify(data))
// 	try {
// 		const user = new accountModel({ ...data })
// 		await user.save()
// 		const res_statistics = await createAccountStatistics(user._id);
// 		const res_settings = await createAccountSettings(user._id);
// 		console.log('Success to create user: ' + user)
// 		return responseSuccess(user)
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const getUserInfo = async (uid) => {
// 	console.log('Get user info')

// 	try {
// 		const user = await accountModel.findOne({ _id: uid })
// 		if (user) {
// 			console.log('User with id: ' + uid + ' was found ' + user);
// 			return responseSuccess(user);
// 		}
// 		else {
// 			return responseWrapper(404, { error: 'User with id: ' + uid + ' was not found' });
// 		}
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const notificationToken = async (data, id) => {
// 	console.log('Update user one signal id with id: ' + id + 'with this token: ' + JSON.stringify(data))
// 	try {
// 		const user = await accountModel.updateOne({ _id: id }, { $set: { oneSignalId: data } })
// 		if (user.n === 0) {
// 			console.log('user with id: ' + id + ' was not found')
// 			return responseWrapper(404, { error: 'user with id: ' + id + ' was not found' });
// 		}
// 		if (user.nModified === 0) {
// 			console.log('User with id:  ' + id + ' is up to date')
// 		}
// 		else {
// 			console.log('update ' + id + ' success')
// 		}
// 		return responseSuccess({ ok: 1 })
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }

// export const getSettings = async (id) => {
// 	console.log('Try to find settings of user with id: ' + id);
// 	try {
// 		const settings = await accountSettingsModel.findOne({ userId: id })
// 		if (settings) {
// 			console.log('Settings with user id: ' + id + ' was found ' + settings);
// 			return responseSuccess({
// 				userTermsVersion: settings.termsVersion,
// 				termsVersion: 0 // TODO
// 			});
// 		}
// 		else {
// 			return responseWrapper(404, { error: 'Settings with user id: ' + id + ' was not found' });
// 		}
// 	} catch (err) {
// 		console.log(err.stack)
// 		return responseWrapper(500, { error: "Internal Server Error" });
// 	}
// }