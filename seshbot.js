const config = require("./config.js");
const commands = require("./logic/commands.js");
const restricted_commands = require("./logic/restricted_commands.js");
const utils = require("./logic/utils.js");

const tmi = require("tmi.js");
const fs = require("fs");
const fsPromises = require("fs").promises;

const chat_log_file = "./IO/chat.log";
const live_msg_file = "./IO/live_message.txt";
const static_commands_JSON_file = "./data/commands.json"
const streamers_JSON_file = "./data/streamers.json";

const seshbot = new tmi.client(config.credentials);
let chat_log = fs.createWriteStream(chat_log_file, { flags: 'a' });

async function main() {
    chat_log.on("error", utils.log_error);
    try {
        let static_commands_buffer = await fsPromises.readFile(static_commands_JSON_file);
        let streamers_buffer = await fsPromises.readFile(streamers_JSON_file);
        await commands.parse_static_commands(static_commands_buffer);
        await restricted_commands.parse_streamers(streamers_buffer);
    }
    catch(e) {
        console.log(e);
    }
    commands.register_all_commands();
    seshbot.connect().catch(console.error);
    seshbot.on("connected", onConnected);
    seshbot.on("chat", onChatting);
    seshbot.on("raided", onRaided);
    seshbot.on("hosted", onHosted);
    seshbot.on("disconnected", onDisconnected);
    fs.watch(live_msg_file, read_live_msg_file);
}

async function execute_message_as_command(channel, username, message) {
    if(!message.startsWith('!'))
        return false;
    let command = await commands.execute_matching_command(username, message);
    if(command == null)
        return false;
    if(command["skipped"] || command["message"] === "")
        return true;
    seshbot.say(channel, config.botname + " " + command["message"]);
    if(command["Twitch_cmd"] != "")
        seshbot.say(channel, command["Twitch_cmd"]);
    return true;
}

function onConnected(address, port) {
    console.log("* " + config.botname + " connected to " + address + ":" + port + " successfully!");
}

function onChatting(channel, tags, message, self) {
    //TODO: detect (code or terminal setting) ANSI color codes in chat message. At least send the username in a different color than white
    chat_log.write(tags.username + ": " + message + `\n`);
    if(self)
        return;
    execute_message_as_command(channel, tags.username, message);
}

function onRaided(channel, username, viewers) {
    seshbot.say(channel, config.botname + " " + username + " raided with " + viewers + " viewers. Thank you very much!");
}

function onHosted(channel, username, viewers, autohost) {
    seshbot.say(channel, config.botname + " " + username + " hosted with " + viewers + " viewers. Thank you very much!");
}

function onDisconnected(reason) {
    console.log("* " + config.botname + " disconnected! Reason: " + reason + ".");
    chat_log.end("Error: " + config.botname + " disconnected!");
}

function read_live_msg_file(event_type, filename) {
    //fs.watch triggers the file's change event twice!? Using a toggling bool to deny one trigger. May not work on all OSs.
    if(typeof accept_event === 'undefined')
        accept_event = false;
    accept_event = !accept_event;
    if(!accept_event)
        return;
    fs.readFile(live_msg_file, onLiveCmd_send);
}

async function onLiveCmd_send(err, buffer) {
    if (err)
        return;
    let message = buffer.toString().trim();
    message = message.split(/\r?\n/)[0];
    if(message === "")
        return;
    let channel = config.credentials.channels[0];
    let username = config.credentials.identity.username;
    let success = await execute_message_as_command(channel, username, message);
    if(!success)
        seshbot.say(channel, config.botname + " " + message);
}

main();
