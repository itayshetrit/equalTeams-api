const uuid = require('uuid');
import axios from 'axios'
import managerModel from '../models/manager'
// return uuid();
import { responseWrapper, responseSuccess } from '../common/respone';

export const addTeam = async (team, id) => {
	console.log(id);
	console.log('add team service');
	try {
		const user = await managerModel.findOne({ _id: id })
		if (user) {
			let isExist = user.teams.filter(x => x === team);
			if(isExist[0]){
				return responseWrapper(409, { error: "קבוצה זו כבר קיימת" });
			}
			user.teams.push(team);
			await user.save()
		}
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}
