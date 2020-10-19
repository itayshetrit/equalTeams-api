import { responseWrapper, responseSuccess } from '../common/respone';

export const elections = async (req) => {
	console.log("elections service");
	try {
		const {list,numOfTeams} = {...req.body};
		console.log(list)
		console.log(numOfTeams)
		return responseSuccess({ ok: 1 })
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

