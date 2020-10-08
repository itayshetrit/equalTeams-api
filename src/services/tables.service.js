const uuid = require('uuid');
import axios from 'axios'

import tablesModel from '../models/tables'
// return uuid();
import { responseWrapper, responseSuccess } from '../common/respone';

export const loadTables = async (req) => {
	try {
		const tables = new tablesModel({ ...req.body })
		await tables.save()
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getTables = async (uid) => {
	console.log('get tables service');
	console.log(uid)
	try {
		const tables = await tablesModel.find({ uid })
		let result = (tables[0].tables[0])
		return responseSuccess(result)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}