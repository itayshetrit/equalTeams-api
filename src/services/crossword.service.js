import crosswordModel from '../models/crossword.model'
import crosswordDefinitionModel from '../models/crossword-definition.model'
import definitionModel from '../models/definition.model'
import { responseWrapper, responseSuccess } from '../common/service-response.service';
var mongoose = require('mongoose');
const logger = require('../common/logger')(__filename);

export const getCrosswordById = async (id) => {
	logger.info('Try to find crossword with id: ' + id)
	try {
		const crossword = await crosswordModel.aggregate([
			{
				$match: { _id: mongoose.Types.ObjectId(id) }
			},
			{
				$unwind: '$crossword'
			},
			{
				$lookup: {
					from: 'definitions',
					let: { 'did': '$crossword.definitionId' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$_id', '$$did'] } } },
						{
							$project: {
								'_id': 1,
								'definition': '$wordDefinition',
								'solution': 1,
								'type': '$dtype'
							}
						}
					],
					as: 'cd'
				}
			},
			{
				$project: {
					'_id': 1,
					'size': 1,
					'type': 1,
					'crossword.type': 1,
					'crossword.index': 1,
					'crossword.arrow_index': 1,
					'crossword.direction': 1,
					'crossword._id': { $arrayElemAt: ['$cd._id', 0] },
					'crossword.solution': { $arrayElemAt: ['$cd.solution', 0] },
					'crossword.definition': { $arrayElemAt: ['$cd.definition', 0] }
				}
			},
			{
				$group: {
					_id: '$_id',
					size: { $first: '$size' },
					type: { $first: '$type' },
					crossword: {
						$push: {
							'_id': '$crossword._id',
							'type': '$crossword.type',
							'index': '$crossword.index',
							'arrow_index': '$crossword.arrow_index',
							'direction': '$crossword.direction',
							'solution': '$crossword.solution',
							'definition': '$crossword.definition'
						}
					}
				}
			}
		])
		return responseSuccess(crossword[0]);
	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

export const getCrosswordByTypeAndLevel = async (type, level, limit, skip) => {
	logger.info('Try to find crosswords by type: ' + type + ' and level: ' + level)
	try {
		let match = { type: type }
		if (level) {
			match = {
				...match, level: level
			}
		}
		const crosswords = await crosswordModel.aggregate([
			{
				$match: match
			},
			
			{
				$project: {
					'_id': 1,
					'level': 1,
					'type': 1,
					'date': 1,
				}
			},
			{
				'$facet': {
					metadata: [{ $count: "total" }, { $addFields: { skip: skip } }]
					, crosswords: [{ $skip: skip }, { $limit: limit }]
				}
			},
			{
				$project: {
					metadata: { '$arrayElemAt': ['$metadata', 0] },
					crosswords: 1
				}
			}
		])
		return responseSuccess(crosswords[0]);
	} catch (err) {
		logger.error(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}
