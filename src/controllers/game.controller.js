

import * as gameService from '../services/game.service';
const logger = require('../common/logger')(__filename);

export const startGame = async (req, res) => {
	logger.info('Start crossword game');
	const crosswordId = req.params.id;
	const uid = req.decoded.uid;
	const resp = await gameService.startGame(crosswordId, uid);
	res.status(resp.status).send(resp.data);
}

export const progressGame = async (req, res) => {
	logger.info('Progress crossword game');
	const crosswordId = req.params.id;
	const uid = req.decoded.uid;
	const solvedDefinitionIds = req.body.solvedDefinitionIds;
	const resp = await gameService.progressGame(crosswordId, uid, solvedDefinitionIds);
	res.status(resp.status).send(resp.data);
}

export const userProgress = async (req, res) => {
	logger.info('User progress crossword game');
	const uid = req.decoded.uid;
	const type = req.query.type;
	const { limit, skip } = req;
	const resp = await gameService.userProgress(uid, type, limit, skip);
	res.status(resp.status).send(resp.data);
}

export const specificProgress = async (req, res) => {
	logger.info('User specific progress crossword game');
	const uid = req.decoded.uid;
	const crosswordId = req.params.id;
	const resp = await gameService.specificProgress(uid, crosswordId);
	res.status(resp.status).send(resp.data);
}

export const getLeaderboard = async (req, res) => {
	logger.info('Get leaderboard');
	const type = req.query.type;
	const { limit, skip } = req;
	const resp = await gameService.getLeaderboard(type, limit, skip);
	res.status(resp.status).send(resp.data);
}
