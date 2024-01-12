const allowed_users = [ "seshoumara" ];
let streamers = {};

function parse_streamers(buffer) {
    let json = buffer.toString().trim();
    streamers = JSON.parse(json);
}

async function execute_so(username, command, streamer) {
    if(!(allowed_users.includes(username))) {
        command["skipped"] = true;
        return;
    }
    command["Twitch_cmd"] += " " + streamer;
    command["message"] = "Check out " + streamer + " and follow his stream at https://www.twitch.tv/" + streamer + " !";
    if(!(streamer in streamers))
        return;
    command["message"] += " " + streamer + " " + streamers[streamer];
}

async function execute_raid(username, command, streamer) {
    //uses the custom shout-out message, but I prefer that when raiding
    await execute_so(username, command, streamer);
}

module.exports = {
    parse_streamers: parse_streamers,
    execute_so: execute_so,
    execute_raid: execute_raid
};
