const tmi = require("tmi.js");
const config = require("./config.js");
const commands = require("./logic/commands.js");

const seshbot = new tmi.client(config.credentials);
seshbot.connect().catch(console.error);
seshbot.on("connected", onConnected);
seshbot.on("chat", onChatting);
seshbot.on("raided", onRaided);
seshbot.on("hosted", onHosted);
seshbot.on("disconnected", onDisconnected);

const fs = require("fs");
const chat_log_file = "./IO/chat.log";
const live_msg_file = "./IO/live_message.txt";

var chat_log = fs.createWriteStream(chat_log_file, { flags: 'a' });
chat_log.on("error", function (err) { console.log(err); });

var accept_event = true;
fs.watch(live_msg_file, function (event_type, filename) {
    accept_event = !accept_event;
    if(!accept_event) {
        return;
    }
	fs.readFile(live_msg_file, onLiveCmd_send);
})

async function execute_message_as_command(channel, username, message) {
    if(!message.startsWith('!')) {
		return false;
	}
	var command = await commands.get_matching_command(username, message);
    if(command == null) {
        return false;
    }
    if(command["skipped"] || command["message"] === "") {
        return true;
    }
    seshbot.say(channel, config.botname + " " + command["message"]);
    if(command["Twitch_cmd"] != ""){
        seshbot.say(channel, command["Twitch_cmd"]);
    }
    return true;
}

function onConnected(address, port) {
	console.log("* " + config.botname + " connected to " + address + ":" + port + " successfully!");
    commands.register_all_commands();
}

function onChatting(channel, tags, message, self) {
	//TODO: detect (code or terminal setting) ANSI color codes in chat message. At least send the username in a different color than white
	chat_log.write(tags.username + ": " + message + `\n`);
    if(self) {
        return;
    }
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

async function onLiveCmd_send(err, buffer) {
	if (err) {
		return;
	}
	var message = buffer.toString().trim();
    var message = message.split(/\r?\n/)[0];
    if(message === "") {
        return;
    }
	var channel = config.credentials.channels[0];
    var username = config.credentials.identity.username;
    var success = await execute_message_as_command(channel, username, message);
    if(!success) {
        seshbot.say(channel, config.botname + " " + message);
    }
}
