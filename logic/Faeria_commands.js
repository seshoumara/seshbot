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

async function execute_tournament(username, command, _) {
    if(!tournament.valid) {
        command["skipped"] = true;
        return;
    }
    command["message"] = tournament.name + " starts on " + tournament.date + " at " + tournament.time + ". Please register at " + tournament.link + " !";
}

async function execute_players(username, command, _) {
    if(!tournament.valid) {
        command["skipped"] = true;
        return;
    }
    var teams_data = await battlefy_api.getTournamentTeams(tournament.ID);
    var players = [];
    for(var t = 0; t < teams_data.length; t++) {
        players.push(teams_data[t].name);
    };
    command["message"] = "Registered: " + players.join(", ") + ".";
}

module.exports = {
    execute_tournament: execute_tournament,
    execute_players: execute_players
};
