const restricted_commands = require("./restricted_commands.js");
const Faeria_commands = require("./Faeria_commands.js");

const utils = require("./utils.js");
const { exec } = require("child_process");

var all_commands_template = [];
var all_commands = [];

async function get_matching_command(username, message) {
    var raw_command = utils.get_raw_command(message);
    var matched_command;
    for(var c = 0; c < all_commands.length; c++) {
        var command = all_commands[c];
        if(command["has_argument"]) {
            if(raw_command.startsWith(command["cmd"])) {
                var argument = raw_command.slice(command["cmd"].length + 1);
                reset_cmd(c);
                await command["execute_callback"](username, command, argument);
                matched_command = command;
                break;
            }
            else {
                continue;
            }
        }
        else {
            if(raw_command === command["cmd"]) {
                reset_cmd(c);
                await command["execute_callback"](username, command, "");
                matched_command = command;
                break;
            }
            else {
                continue;
            }
        }
    }
    utils.log_command(username, raw_command, (matched_command != null), ((matched_command == null) ? "" : matched_command["skipped"]));
    return matched_command;
}

function register_all_commands() {
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!bot",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "",
        "skipped": false,
        "execute_callback": execute_bot
    });
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!itch",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "Check out my game dev profile at https://seshoumara.itch.io !",
        "skipped": false,
        "execute_callback": default_execute
    });
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!LLH",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "Low Level Hero is a programming-puzzle game with only two commands: copy-paste and search-replace. Try the game at https://seshoumara.itch.io/low-level-hero !",
        "skipped": false,
        "execute_callback": default_execute
    });
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!jam",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "Check out my latest game jam entry at https://itch.io/jam/linux-game-jam2023/rate/2106142 !",
        "skipped": false,
        "execute_callback": default_execute
    });
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!discord",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "Please join my Discord server at https://discord.gg/8pWpB59YKZ !",
        "skipped": false,
        "execute_callback": default_execute
    });
    all_commands_template.push({
        "category": "General",
        "hide": false,
        "cmd": "!tts",
        "has_argument": true,
        "argument_hint": "<text>",
        "Twitch_cmd": "",
        "message": "",
        "skipped": false,
        "execute_callback": execute_tts
    });
    all_commands_template.push({
        "category": "Restricted",
        "hide": true,
        "cmd": "!so",
        "has_argument": true,
        "argument_hint": "<streamer>",
        "Twitch_cmd": "/shoutout",
        "message": "",
        "skipped": false,
        "execute_callback": restricted_commands.execute_so
    });
    all_commands_template.push({
        "category": "Restricted",
        "hide": true,
        "cmd": "!raid",
        "has_argument": true,
        "argument_hint": "<streamer>",
        "Twitch_cmd": "/raid",
        "message": "",
        "skipped": false,
        "execute_callback": restricted_commands.execute_raid
    });
    all_commands_template.push({
        "category": "Faeria",
        "hide": false,
        "cmd": "!tournament",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "",
        "skipped": false,
        "execute_callback": Faeria_commands.execute_tournament
    });
    all_commands_template.push({
        "category": "Faeria",
        "hide": false,
        "cmd": "!players",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "",
        "skipped": false,
        "execute_callback": Faeria_commands.execute_players
    });
    for(var c = 0; c < all_commands_template.length; c++) {
        var command = all_commands_template[c];
        var command_clone = {};
        for(var key in command) {
            command_clone[key] = command[key];
        }
        all_commands.push(command_clone);
    }
}

function reset_cmd(idx) {
    var keys = [ "Twitch_cmd", "message", "skipped" ];
    for(var k = 0; k < keys.length; k++) {
        var key = keys[k];
        all_commands[idx][key] = all_commands_template[idx][key];
    }
}

async function default_execute(username, command, _) {}

async function execute_tts(username, command, tts_message) {
    var max_TTS_msg_length = 200;
    if(tts_message.length > max_TTS_msg_length) {
        command["skipped"] = true;
        return;
    }
    //BUG: the festival command crashes, no sound (tested on Ubuntu)
    exec("echo -E -- '" + tts_message + "'|cut -c4-|festival --tts");
}

async function execute_bot(username, command, _) {
    var category_commands = {};
    for(var c = 0; c < all_commands.length; c++) {
        var other_command = all_commands[c];
        if(other_command["hide"])
            continue;
        if(!(other_command["category"] in category_commands))
            category_commands[other_command["category"]] = "";
        category_commands[other_command["category"]] += " " + other_command["cmd"];
        if(other_command["argument_hint"] != "")
            category_commands[other_command["category"]] += " " + other_command["argument_hint"];
        category_commands[other_command["category"]] += ",";
    }
    command["message"] = "General:" + category_commands["General"] + ".";
    for(var categ in category_commands) {
        if(categ != "General")
            command["message"] += " " + categ + ":" + category_commands[categ] + ".";
    }
    command["message"] = command["message"].replace(/,\./g, '.');
}

module.exports = {
    get_matching_command: get_matching_command,
    register_all_commands: register_all_commands
};
