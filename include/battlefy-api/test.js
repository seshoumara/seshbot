const battlefy_api = require('./');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function test_tournament_players(tournament_ID) {
    const teams_data = await battlefy_api.getTournamentTeams(tournament_ID);
    var players = [];
    for(var t = 0; t < teams_data.length; t++) {
        players.push(teams_data[t].name);
    };
    console.log(players.join(", "));
    await sleep(60000);
}

async function test_tournament_matches(tournament_ID) {
    const tournament_data = await battlefy_api.getTournamentData(tournament_ID);
    const stage_ID = tournament_data.stageIDs[0];
    console.log("Stage ID: " + stage_ID);
    await sleep(60000);
    const matches = await battlefy_api.getTournamentStageMatches(stage_ID);
    console.log(matches[0]);
    await sleep(60000);
}

async function main() {
    const tournament_ID = "656cf1cb137c9714e15b0006";
    console.log("Starting tests with tournament ID: " + tournament_ID + "\n");
    console.log("-> Registered players:");
    await test_tournament_players(tournament_ID);
    //console.log("-> Matches:");
    //await test_tournament_matches(tournament_ID);
    console.log("\nTests finished!");
}

main();
