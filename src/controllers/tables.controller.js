import * as tablesService from '../services/tables.service';


export const addUser = async (req, res) => {
	const resp = await tablesService.addUser(req);
	res.status(resp.status).send(resp.data);
}

export const loadTables = async (req, res) => {
	console.log('get users controller')
	const resp = await tablesService.loadTables(req);
	res.status(resp.status).send(resp.data);
}

export const updateUser = async (req, res) => {
	console.log('update user');
	const uid = req.decoded.uid;
	const user = req.body;
	const resp = await tablesService.updateUser(user, uid);
	res.status(resp.status).send(resp.data);
}

export const notificationToken = async (req, res) => {
	console.log('update notification token');
	const oneSignalId = req.body.oneSignalId;
	const uid = req.decoded.uid;
	const resp = await tablesService.notificationToken(oneSignalId, uid);
	res.status(resp.status).send(resp.data);
}

export const getSettings = async (req, res) => {
	console.log('get user settings');
	const uid = req.decoded.uid;
	const resp = await tablesService.getSettings(uid);
	res.status(resp.status).send(resp.data);
}