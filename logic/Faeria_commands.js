const battlefy_api = require("../include/battlefy-api/");

var tournament = get_upcoming_Faeria_tournament();

function get_upcoming_Faeria_tournament() {
    //TODO: use Battlefy API to automate getting the upcoming Faeria tournament (do it once at the start of seshbot)
    return {
        ID: "656cf22b7955cb14eb16f0ab",
        name: "Seifer Open #5",
        date: "Saturday, December 23rd",
        time: "19:00 EET",
        link: "https://battlefy.com/abrakam-entertainment/seifer-open-5/656cf22b7955cb14eb16f0ab/info",
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

//TODO: cache data of previous request from Twitch and update only if no cache or time past is at least 5 minutes (reduce usage of Battlefy's API)
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
