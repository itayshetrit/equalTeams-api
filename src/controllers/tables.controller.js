import * as tablesService from '../services/tables.service';

export const loadTables = async (req, res) => {
	console.log('load tables controller')
	const resp = await tablesService.loadTables(req);
	res.status(resp.status).send(resp.data);
}

export const getTables = async (req, res) => {
	console.log('get tables controller')
	const uid = req.user._id;
	const resp = await tablesService.getTables(uid);
	res.status(resp.status).send(resp.data);
}