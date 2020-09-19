import * as accountsService from '../services/accounts.service';


export const addUser = async (req, res) => {
	const resp = await accountsService.addUser(req);
	res.status(resp.status).send(resp.data);
}

export const getUsers = async (req, res) => {
	console.log('get users controller')
	const resp = await accountsService.getUsers();
	res.status(resp.status).send(resp.data);
}

export const updateUser = async (req, res) => {
	console.log('update user');
	const uid = req.decoded.uid;
	const user = req.body;
	const resp = await accountsService.updateUser(user, uid);
	res.status(resp.status).send(resp.data);
}

export const notificationToken = async (req, res) => {
	console.log('update notification token');
	const oneSignalId = req.body.oneSignalId;
	const uid = req.decoded.uid;
	const resp = await accountsService.notificationToken(oneSignalId, uid);
	res.status(resp.status).send(resp.data);
}

export const getSettings = async (req, res) => {
	console.log('get user settings');
	const uid = req.decoded.uid;
	const resp = await accountsService.getSettings(uid);
	res.status(resp.status).send(resp.data);
}