import * as electionsService from '../services/elections.service';

export const elections = async (req, res) => {
	console.log('elections controller')
	const resp = await electionsService.elections(req);
	res.status(resp.status).send(resp.data);
}

