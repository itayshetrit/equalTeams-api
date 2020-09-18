

import * as authService from '../services/auth.service';



export const login = async (req, res) => {
	console.log('login controller');
	const { phone, password} = req.body;
	const resp = await authService.login(phone, password);
	res.status(resp.status).send(resp.data);
}


export const checkAuth = async (req, res) => {
	console.log('checkAuth controller')
	const resp = await authService.checkAuth(req);
	res.status(resp.status).send(resp.data);
}

// export const anonymousLogin = async (req, res) => {
// 	console.log('Anonymous login')
// 	const { idToken } = req.body
// 	const resp = await authService.anonymousLogin(idToken);
// 	res.status(resp.status).send(resp.data);
// }

// export const getUserInfo = async (req, res) => {
// 	console.log('Fetching user info by jwt ');
// 	const uid=req.decoded.uid;
// 	const resp = await authService.getUserInfo(uid);
// 	res.status(resp.status).send(resp.data);
// }
