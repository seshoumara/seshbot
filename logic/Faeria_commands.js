const battlefy_api = require("../include/battlefy-api/");

let tournament = get_upcoming_Faeria_tournament();

//TODO: use Battlefy API to automate getting the upcoming Faeria tournament (do it once at the start of seshbot)
function get_upcoming_Faeria_tournament() {
    return {
        ID: "6882eb273181c6002105365e",
        name: "Khalim open #1",
        date: "Saturday, August 9th",
        time: "19:00 EEST",
        link: "https://battlefy.com/abrakam-entertainment/khalim-open-1-2025/6882eb273181c6002105365e/info",
        //if none, then mark it as invalid
        valid: true
    }
}

////TODO: use Battlefy API to automate getting the upcoming Faeria tournament (do it once at the start of seshbot)
//function get_upcoming_Faeria_tournament() {
   // return {
        //ID: "6882ee610c0c7c00228f4f47",
        //name: "Khalim Open #2",
        //date: "Saturday, August 23rd",
        //time: "19:00 EEST",
        //link: "https://battlefy.com/abrakam-entertainment/khalim-open-2-2025/6882ee610c0c7c00228f4f47/info",
        ////if none, then mark it as invalid
        //valid: true
    //}
//}

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
