const fs = require('fs');
var chat_stream = fs.createWriteStream("chat.log", { flags: 'a' });
chat_stream.on('error', function (err) { console.log(err); });

const tmi = require('tmi.js');
const credentials = require('./credentials.js');
const battlefy_api = require('../battlefy-api/');

const config = {
	channels: [ 'seshoumara' ],
	identity: {
		username: credentials.get_username(),
		password: credentials.get_token()
	}
};

const tournament = get_upcoming_Faeria_tournament();

const seshbot = new tmi.client(config);
seshbot.on('connected', onConnected);
seshbot.on('disconnected', onDisconnected);
seshbot.on('chat', onChatting);
seshbot.on('raided', onRaided);
seshbot.on('hosted', onHosted);
seshbot.connect().catch(console.error);

function onConnected(address, port) {
	console.log(`* seshbot connected to ${address}:${port} successfully!`);
}

function onDisconnected(reason) {
	console.log(`* seshbot disconnected! Reason: ${reason}.`);
	chat_stream.end('Error: seshbot disconnected!');
}

function onChatting(channel, tags, message, self) {
	//TODO: detect (code or terminal setting) ANSI color codes in chat message. At least send the username in a different color than white
	//chat_stream.once('open', function(fd) { chat_stream.write(message); chat_stream.end(); });
	chat_stream.write(tags.username + ": " + message + `\n`);
	if(self || !message.startsWith('!')) {
		return;
	}
	const cmd = message.trim();
	var success = false;
	var skipped = false;
	
	if(tags.username === 'seshoumara') {
		if(cmd.startsWith('!so ')) {
			var streamer = cmd.slice(4);
			var response = `[seshbot] Check out ${streamer} and follow his stream at https://www.twitch.tv/${streamer} !`;
			switch(streamer) {
				case 'Aarimous':
					response += ` ${streamer} is working on releasing Chess Survivors: a grid based, quick-turn, roguelike where you outmaneuver and destroy an ever growing horde of chess enemies. Go wishlist the game on https://store.steampowered.com/app/2065000/Chess_Survivors/ !`;
					break;
				case 'joxon_art':
					response += ` Joxon is an amazing Fantasy Artist, you can see his portfolio at https://darkojovanov.artstation.com/ !`;
					break;
				case 'dev_spajus':
					response += ` ${streamer} is working on releasing Stardeus: a sci-fi colony management simulator with aspects of automation, base building and space exploration. Go wishlist the game on https://store.steampowered.com/app/1380910/Stardeus/ !`
					break;
				case 'jotson':
					response += ` ${streamer} has released Gravity Ace: a 2D multi-directional gravity shooter (cave-flyer). Go wishlist the game on https://store.steampowered.com/app/1003860/Gravity_Ace/ !`
				case 'moonfassa':
					response += ` ${streamer} is a competitive Faeria streamer and content creator. Check out also his Youtube channel: https://www.youtube.com/c/Moonfassa !`
					break;
			}
			seshbot.say(channel, response);
			success = true;
		}
		else if(cmd.startsWith('!raid ')) {
			var streamer = cmd.slice(6);
			seshbot.say(channel, `/raid ${streamer}`);
			success = true;
		}
	}
	if(!success) {
		switch(cmd) {
			case '!bot':
				seshbot.say(channel, `[seshbot] General commands: !bot, !itch, !game, !discord. Faeria commands: !tournament, !players.`);
				success = true;
				break;
			case '!itch':
				seshbot.say(channel, `[seshbot] Check out my itch.io page at https://seshoumara.itch.io !`);
				success = true;
				break;
			case '!game':
				seshbot.say(channel, `[seshbot] Low Level Hero is a programming-puzzle game with only two commands: copy-paste and search-replace. The alpha version is now out on https://seshoumara.itch.io/low-level-hero !`);
				success = true;
				break;
			case '!discord':
				seshbot.say(channel, `[seshbot] Please join my Discord server at https://discord.gg/8pWpB59YKZ !`);
				success = true;
				break;
			case '!tournament':
				if(tournament.valid) {
					seshbot.say(channel, `[seshbot] ${tournament.name} starts on ${tournament.date} at ${tournament.time}. Please register at ${tournament.link} !`);
				}
				else {
					skipped = true;
				}
				success = true;
				break;
			case '!players':
				if(tournament.valid) {
					battlefy_api.getTournamentTeams(tournament.ID).then(
						function (teams_data) { send_upcoming_Faeria_tournament_players(channel, teams_data); }
					);
				}
				else {
					skipped = true;
				}
				success = true;
				break;
		}
	}
	log_command(tags.username, cmd, success, skipped);
}

function get_upcoming_Faeria_tournament() {
	//TODO: use Battlefy API to automate getting the upcoming Faeria tournament, if any!
	var tournament = {
		ID: "63154454d1b59f432de95b7c",
		name: "Khalim Open #4",
		date: "Saturday, September 24th",
		time: "18:00 CEST",
		link: "https://battlefy.com/abrakam-entertainment/khalim-open-4-2022/63154454d1b59f432de95b7c/info",
		valid: true	//to be removed if tournament gathering is automated!
	}
	return tournament;
}

function send_upcoming_Faeria_tournament_players(channel, teams_data) {
	var players = [];
	teams_data.forEach(
		function (team) { players.push(team.name); }
	);
	seshbot.say(channel, `[seshbot] Faeria players registered: ${players.join(", ")}.`);
}

function onRaided(channel, username, viewers) {
	seshbot.say(channel, `[seshbot] ${username} raided with ${viewers} viewers. Thank you very much!`);
}

function onHosted(channel, username, viewers, autohost) {
	seshbot.say(channel, `[seshbot] ${username} hosted with ${viewers} viewers. Thank you very much!`);
}

function log_command(user, cmd, is_matched, is_skipped) {
	var state = 'Executed';
	if(is_skipped) {
		state = 'Skipped';
	}
	if(!is_matched) {
		state = 'Unknown';
	}
	console.log(`* ${state} command: ${cmd} (${user})`);
}
