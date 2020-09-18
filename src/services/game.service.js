import gameModel from '../models/game.model'
import crosswordModel from '../models/crossword.model'
import accountModel from '../models/account.model'
import * as _ from 'lodash';
var mongoose = require('mongoose');
import { responseWrapper, responseSuccess } from '../common/service-response.service';

const logger = require('../common/logger')(__filename);

export const specificProgress = async (uid, crosswordId) => {
	logger.info('Try to find game by uid id: ' + uid + ' and crossword id: ' + crosswordId)
	try {
		let game = await gameModel.aggregate([
			{ $match: { userId: uid, crosswordId: crosswordId } },
			{
				$project: {
					solvedDefinitionIds: 1,
					crosswordId: 1,
					duration: 1,
					progress: '$completePercent'
				}
			}
		])
		if (game.length > 0) {
			logger.info('Game was found: ' + JSON.stringify(game))
			return responseSuccess(game[0]);
		}
		else {
			logger.info('Game was not found')
			return responseWrapper(404, { error: "Game was not found" });
		}

	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const userProgress = async (uid, type, limit, skip) => {
	logger.info('Fetch games of user with id: ' + uid);
	try {
		let aggregateArray = [];
		let match = { userId: uid };
		if (type) {
			match = { ...match, crosswordType: type };
		}
		aggregateArray.push({ $match: match },
			{
				$project: {
					crosswordId: 1,
					type: '$crosswordType',
					progress: '$completePercent'
				}
			},
			{
				$facet: {
					metadata: [{ $count: "total" }, { $addFields: { skip: skip } }],
					games: [{ $skip: skip }, { $limit: limit }]
				}
			},
			{
				$project: {
					metadata: { '$arrayElemAt': ['$metadata', 0] },
					games: 1
				}
			}
		)
		let games = await gameModel.aggregate(aggregateArray)
		if (games.length < 0) {
			logger.error(err.stack)
			return responseWrapper(500, { error: "Internal Server Error" });
		}
		games = games[0];
		if (games.games.length > 0) {
			logger.info('Found ' + games.games.length + ' games');
			return responseSuccess(games);
		}

		games = [{ games: [], metadata: [{ total: 0, skip }] }]
		logger.info('games were not found')
		return responseSuccess(games);

	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const progressGame = async (crosswordId, uid, solvedDefinitionIds) => {
	logger.info('Player with id: ' + uid + ' is playing at crossword with id: ' + crosswordId + ' and he solved these definitions: ' + solvedDefinitionIds);
	try {
		const game = await getGameByUserIdAndCrosswordId(crosswordId, uid)
		if (!game) {
			return responseWrapper(404, { error: "Game was not found" });
		}
		const crossword = await getCrosswordById(crosswordId)
		if (!crossword) {
			return responseWrapper(404, { error: "Crossword was not found" });
		}
		let modifications = solvedDefinitionIds.filter(x => !game.solvedDefinitionIds.includes(x))
		let temp = _.union(game.solvedDefinitionIds, solvedDefinitionIds);
		// TODO update score
		game.solvedDefinitionIds = temp;
		game.completePercent = (solvedDefinitionIds.length / crossword.crossword.length * 100);
		if (game.completePercent >= 100) {
			game.finishDate = new Date();
		}
		game.duration = game.duration + (new Date() - game.resumeDate)
		game.resumeDate = new Date();
		await game.save();
		logger.info('The game was successfuly updated: ' + game)
		return responseSuccess({ ok: 1 })
	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const startGame = async (crosswordId, uid) => {
	logger.info('Player with id: ' + uid + ' start crossword with id: ' + crosswordId);
	try {
		const game = await getGameByUserIdAndCrosswordId(crosswordId, uid)
		if (!game) {
			const crossword = await getCrosswordById(crosswordId)
			if (!crossword) {
				return responseWrapper(404, { error: "Crossword was not found" });
			}
			const game = new gameModel({
				userId: uid,
				crosswordId: crosswordId,
				crosswordType: crossword.type
			})
			await game.save()
			logger.info('Success to create game: ' + game)
			return responseSuccess({ ok: 1 })
		}
		else {
			game.resumeDate = new Date();
			await game.save();
			logger.info('Success to resume game: ' + game)
			return responseSuccess({ ok: 1 })
		}

	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

const getCrosswordById = async (crosswordId) => {
	logger.info('Try to find crossword by id: ' + crosswordId)
	try {
		const crossword = await crosswordModel.findOne({ _id: mongoose.Types.ObjectId(crosswordId) })
		if (crossword) {
			logger.info('Crossword with id: ' + crosswordId + ' was found: ' + crossword)
			return crossword;
		}
		else {
			logger.info('Crossword with id: ' + crosswordId + ' was not found')
			return null;
		}

	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

const getGameByUserIdAndCrosswordId = async (crosswordId, uid) => {
	logger.info('Try to find game by crossword id: ' + crosswordId + ' and user id: ' + uid)
	try {
		const game = await gameModel.findOne({ crosswordId: crosswordId, userId: uid })
		if (game) {
			logger.info('Game was found: ' + game)
			return game;
		}
		else {
			logger.info('Game was not found')
			return null;
		}

	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getLeaderboard = async (type, limit, skip) => {
	logger.info('Get leaderboard by type: ' + type)
	try {
		const leaderboards = await accountModel.aggregate([
			// {
			// 	$match: { type: type }
			// },
			{
				$lookup: {
					from: 'statistics',
					let: { 'uid': '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$userId', '$$uid'] } } },
						{
							$project: {
								'userId': 1,
								'score': 1,
							}
						}
					],
					as: 'cd'
				}
			},
			{
				$unwind: '$cd'
			},
			{
				$project: {
					'_id': 0,
					'fullName': 1,
					'userId': '$cd.userId',
					'score': '$cd.score'
				}
			},
			{
				'$facet': {
					metadata: [{ $count: "total" }, { $addFields: { skip: skip } }]
					, leaderboard: [{ $skip: skip }, { $limit: limit }]
				}
			},
			{
				$project: {
					metadata: { '$arrayElemAt': ['$metadata', 0] },
					leaderboard: 1
				}
			}
		])
		return responseSuccess(leaderboards[0]);
	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

