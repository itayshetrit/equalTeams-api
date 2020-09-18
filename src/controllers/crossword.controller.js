

import * as authService from '../services/crossword.service';
import * as gameService from '../services/game.service';
const logger = require('../common/logger')(__filename);

export const getCrosswordByTypeAndLevel = async (req, res) => {
	logger.info('Fetching crossword by type');
	const { type, level } = req.query;
	const { limit, skip } = req;
	const resp = await authService.getCrosswordByTypeAndLevel(type, level, limit, skip);
	res.status(resp.status).send(resp.data);
}

export const getCrosswordById = async (req, res) => {
	logger.info('Fetching crossword by id');
	const crosswordId = req.params.id;
	const resp = await authService.getCrosswordById(crosswordId);
	res.status(resp.status).send(resp.data);
}
