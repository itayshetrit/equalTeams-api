import * as managerService from '../services/manager.service';


export const addTeam = async (req, res) => {
	console.log('add user controller')
	const team=req.body.team;
	const uid=req.user._id;
	const resp = await managerService.addTeam(team,uid);
	res.status(resp.status).send(resp.data);
}
