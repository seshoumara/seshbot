const battlefy_api = require("../../battlefy-api/");

var tournament = get_upcoming_Faeria_tournament()

function get_upcoming_Faeria_tournament() {
	//TODO: use Battlefy API to automate getting the upcoming Faeria tournament
	return {
		ID: "648a7273b9bd865dcf2702ab",
		name: "Ruunin Open #2",
		date: "Saturday, June 24th",
		time: "18:00 CEST",
		link: "https://battlefy.com/abrakam-entertainment/ruunin-open-2/648a7273b9bd865dcf2702ab/info",
        //if none, then mark it as invalid
		valid: true
	}
}

function execute_tournament(username, command, _) {
    if(!tournament.valid) {
        command["skipped"] = true;
        return;
    }
    command["message"] = tournament.name + " starts on " + tournament.date + " at " + tournament.time + ". Please register at " + tournament.link + " !";
}

function execute_players(username, command, _) {
    if(!tournament.valid) {
        command["skipped"] = true;
        return;
    }
    var players = [];
    battlefy_api.getTournamentTeams(tournament.ID).then( function (teams_data) {
        teams_data.forEach(function (team) {
            players.push(team.name);
        });
    });
    command["message"] = "Registered: " + players.join(", ") + ".";
}

module.exports = {
    execute_tournament: execute_tournament,
    execute_players: execute_players
};
