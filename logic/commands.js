const restricted_commands = require("./restricted_commands.js");
const Faeria_commands = require("./Faeria_commands.js");
const utils = require("./utils.js");

const { exec } = require("child_process");

let static_commands = [];
let all_commands_template = [];
let all_commands = [];

function parse_static_commands(buffer) {
    let json = buffer.toString().trim();
    static_commands = JSON.parse(json);
}

async function execute_matching_command(username, message) {
    let raw_command = utils.get_raw_command(message);
    let matched_command;
    for(let c = 0; c < all_commands.length; c++) {
        let command = all_commands[c];
        if(command["has_argument"]) {
            if(raw_command.startsWith(command["cmd"])) {
                let argument = raw_command.slice(command["cmd"].length + 1);
                reset_command_to_template(command);
                if("execute_callback" in command)
                    await command["execute_callback"](username, command, argument);
                matched_command = command;
                break;
            }
            continue;
        }
        if(raw_command === command["cmd"]) {
            reset_command_to_template(command);
            if("execute_callback" in command)
                await command["execute_callback"](username, command, "");
            matched_command = command;
            break;
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
    for(let c = 0; c < static_commands.length; c++) {
        let static_command = static_commands[c];
        let static_command_clone = {};
        for(let key in static_command) {
            static_command_clone[key] = static_command[key];
        }
        all_commands_template.push(static_command_clone);
    }
    all_commands_template.push({
        "category": "General",
        "hide": true,
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
        "hide": true,
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
        "hide": true,
        "cmd": "!players",
        "has_argument": false,
        "argument_hint": "",
        "Twitch_cmd": "",
        "message": "",
        "skipped": false,
        "execute_callback": Faeria_commands.execute_players
    });
    for(let c = 0; c < all_commands_template.length; c++) {
        let command = all_commands_template[c];
        if(command["hide"])
            continue;
        let command_clone = {};
        for(let key in command) {
            command_clone[key] = command[key];
        }
        all_commands.push(command_clone);
    }
}

function reset_command_to_template(command) {
    //a prior command execution changes the following keys
    let keys = [ "Twitch_cmd", "message", "skipped" ];
    //all_commands and all_commands_template have different sizes/order!
    let command_template;
    for(let c = 0; c < all_commands_template.length; c++) {
        let command_candidate = all_commands_template[c];
        if(command["cmd"] === command_candidate["cmd"]) {
            command_template = command_candidate;
            break;
        }
    }
    for(let k = 0; k < keys.length; k++) {
        let key = keys[k];
        command[key] = command_template[key];
    }
}

async function execute_tts(username, command, tts_message) {
    let max_TTS_msg_length = 200;
    if(tts_message.length > max_TTS_msg_length) {
        command["skipped"] = true;
        return;
    }
    //BUG: the festival command crashes, no sound (tested on Ubuntu)
    exec("echo -E -- '" + tts_message + "'|cut -c4-|festival --tts");
}

async function execute_bot(username, command, _) {
    let category_commands = {};
    for(let c = 0; c < all_commands.length; c++) {
        let other_command = all_commands[c];
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
    for(let categ in category_commands) {
        if(categ != "General")
            command["message"] += " " + categ + ":" + category_commands[categ] + ".";
    }
    command["message"] = command["message"].replace(/,\./g, '.');
}

module.exports = {
    parse_static_commands: parse_static_commands,
    execute_matching_command: execute_matching_command,
    register_all_commands: register_all_commands
};
