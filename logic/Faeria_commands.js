const battlefy_api = require("../include/battlefy-api/");

let tournament = get_upcoming_Faeria_tournament();

//TODO: use Battlefy API to automate getting the upcoming Faeria tournament (do it once at the start of seshbot)
function get_upcoming_Faeria_tournament() {
    return {
        ID: "670f2ac8d9120600378e2e0a",
        name: "Khalim Seasonal Cup",
        date: "Saturday, October 26th",
        time: "17:00 EET",
        link: "https://battlefy.com/abrakam-entertainment/khalim-seasonal-cup/670f2ac8d9120600378e2e0a/info",
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
    let teams_data = await battlefy_api.getTournamentTeams(tournament.ID);
    let players = [];
    for(let t = 0; t < teams_data.length; t++) {
        players.push(teams_data[t].name);
    };
    command["message"] = "Registered: " + players.join(", ") + ".";
}

module.exports = {
    execute_tournament: execute_tournament,
    execute_players: execute_players
};
