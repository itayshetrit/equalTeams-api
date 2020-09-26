import * as guestsService from '../services/guests.service';


export const addUser = async (req, res) => {
	const resp = await accountsService.addUser(req);
	res.status(resp.status).send(resp.data);
}

export const setGuestTable = async (req, res) => {
	console.log('set guest table controller')
	const {id,table}={...req.body}
	const resp = await guestsService.setGuestTable(id,table);
	res.status(resp.status).send(resp.data);
}

export const getGuests = async (req, res) => {
	console.log('get guests controller')
	const uid = req.user._id;
	const resp = await guestsService.getGuests(uid);
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