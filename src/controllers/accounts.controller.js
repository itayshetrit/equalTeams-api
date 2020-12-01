import * as accountsService from '../services/accounts.service';


export const addUser = async (req, res) => {
	console.log('add user controller')
	const body=req.body;
	const uid=req.user._id;
	const resp = await accountsService.addUser(body,uid);
	res.status(resp.status).send(resp.data);
}

export const getUsers = async (req, res) => {
	console.log('get users controller')
	const team = req.params.team;
	const resp = await accountsService.getUsers(team);
	// const resp = await accountsService.getUsers();
	res.status(resp.status).send(resp.data);
}

export const editUser = async (req, res) => {
	console.log('update user');
	const id = req.params.id;
	const body = req.body;
	const resp = await accountsService.editUser(body, id);
	res.status(resp.status).send(resp.data);
}

export const deleteUser = async (req, res) => {
	console.log('delete user');
	const id = req.params.id;
	const resp = await accountsService.deleteUser(id);
	res.status(resp.status).send(resp.data);
}