import * as accountsService from '../services/accounts.service';


export const addUser = async (req, res) => {
	console.log('add user controller')
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
