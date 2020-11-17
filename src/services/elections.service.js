import { responseWrapper, responseSuccess } from '../common/respone';

export const elections = async (req) => {
	console.log("elections service");
	try {
		const { list, numOfTeams } = { ...req.body };
		//console.log(list)
		const numberOfPlayers = list.length
		//console.log("numberOfPlayers",numberOfPlayers)
		if (numberOfPlayers % numOfTeams != 0) {
			// TODO: need to rerurn error
			return responseWrapper(500, { error: "מספר השחקנים שנבחרו לא תקין" });
		}
		const numberOfPlayersInTeam = numberOfPlayers / numOfTeams
		//console.log("numberOfPlayersInTeam",numberOfPlayersInTeam)
		//console.log(numOfTeams)
		const orderingByAttack = list.sort((a, b) => parseInt(b.attack) - parseInt(a.attack)).slice()
		const orderingByDefense = list.sort((a, b) => parseInt(b.defense) - parseInt(a.defense)).slice()
		// console.log("Attack",orderingByAttack)
		// console.log("Defense",orderingByDefense)
		var teams = new Array(numOfTeams)
		for (var i = 0; i < teams.length; i++) {

			teams[i] = new Array(3)

			// Index=0 will include all the the players in the team
			teams[i][0] = []

			//Index = 1 will include the sum of all the defense and attack qualities
			teams[i][1] = 0

			//Index = 2 will be flag if we are chooshe player to this team or not
			teams[i][2] = false

		}
		var random = Math.floor(Math.random() * 2);
		console.log("random", random)
		var isAttack = true
		if (random == 0) {
			isAttack = false;
		}

		while (orderingByAttack.length != 0 || orderingByDefense != 0) {
			if (isAttack && orderingByAttack.length != 0) {
				console.log("isAttack", isAttack)
				roundMaker(numOfTeams, orderingByAttack, orderingByDefense, teams, isAttack)
				isAttack = false
			}
			else if (!isAttack && orderingByDefense.length != 0) {
				console.log("isAttack", isAttack)
				roundMaker(numOfTeams, orderingByDefense, orderingByAttack, teams, isAttack)
				isAttack = true
			}
		}

		//TODO: need to remove
		for (var i = 0; i < numOfTeams; i++) {
			console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
			console.log("Teams" + i)
			for (var j = 0; j < teams[i][0].length; j++) {
				console.log("player " + j + ": ", teams[i][0][j].fname)
			}
		}

		return responseSuccess(teams)
	} catch (err) {
		console.log(err.stack)
		return responseWrapper(500, { error: "Internal Server Error" });
	}
}

var roundMaker = function (numOfTeams, listForShift, listForRemove, teams, isAttack) {

	const playersArray = []
	for (var j = 0; j < numOfTeams; j++) {
		playersArray.push(listForShift.shift())
	}
	playersArray.sort((a, b) => ((parseInt(b.attack) + parseInt(b.defense) / 2) - (parseInt(a.attack) + parseInt(a.defense) / 2))).slice()
	//TODO: need to fix the issue when we have the same average we need to tae the player with higher attack/defense		
	// || isAttack ? parseInt(a.attack) - parseInt(b.attack) : parseInt(a.defense) - parseInt(b.defense)).slice()
	console.log("playersArray", playersArray)

	for (var i = 0; i < numOfTeams; i++) {
		const player = playersArray.shift()
		var teamWithMinScore = getTeamWithMinScore(teams, numOfTeams)
		// TODO: get the best of top 3 base on attack and defense average
		console.log("player", player.fname)

		console.log("--------------------------------------------------------------")
		const indexOfPlayerInListForRemove = listForRemove.indexOf(player);
		//console.log(indexOfPlayerInListForRemove);
		if (indexOfPlayerInListForRemove > -1) {
			listForRemove.splice(indexOfPlayerInListForRemove, 1);
		}
		// console.log("player",player)
		// console.log("teamWithMinScor",teamWithMinScore)
		// console.log("teams[teamWithMinScore]",teams[teamWithMinScore])

		teams[teamWithMinScore][0].push(player)
		teams[teamWithMinScore][1] += player.attack + player.defense
		teams[teamWithMinScore][2] = true
		// console.log("teams[teamWithMinScore][0]",teams[teamWithMinScore][0])

	}

	for (var i = 0; i < numOfTeams; i++) {
		teams[i][2] = false
	}
}

var getTeamWithMinScore = function (teams, numOfTeams) {
	var minScore = Number.MAX_VALUE
	var minIndex = new Array()
	for (var i = 0; i < numOfTeams; i++) {
		if (teams[i][2] == false) {
			if (teams[i][0].length == 0) {
				minIndex.push(i)
			}
			else {
				var teamAverageScore = teams[i][1] / teams[i][0].length;
				if (teamAverageScore == minScore) {
					minIndex.push(i)
				}
				else if (teamAverageScore < minScore) {
					minScore = teamAverageScore;
					minIndex = []
					minIndex.push(i)
				}
			}
		}
	}
	console.log("minScore", minScore)
	var random = Math.floor(Math.random() * minIndex.length);
	console.log("Index min team ", minIndex[random])
	console.log("min index array ", minIndex)
	return minIndex[random];

	//	return {elections:[[],[],[]], laundry:["gal","itay","..."]}

}
