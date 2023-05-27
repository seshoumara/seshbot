const fs = require('fs');
var chat_stream = fs.createWriteStream("chat.log", { flags: 'a' });
chat_stream.on('error', function (err) { console.log(err); });

const tmi = require('tmi.js');
const credentials = require('./credentials.js');
const battlefy_api = require('../battlefy-api/');

const { exec } = require('child_process');


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

const max_TTS_msg_length = 200;

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
	var cmd = message.trim();
	var success = false;
	var skipped = false;
	
	if(tags.username === 'seshoumara') {
		if(cmd.startsWith('!so ')) {
			var streamer = cmd.slice(4);
			var response = `[seshbot] Check out ${streamer} and follow his stream at https://www.twitch.tv/${streamer} !`;
			switch(streamer) {
				case 'Aarimous':
					response += ` ${streamer} has released Chess Survivors: a grid based, quick-turn, roguelike where you outmaneuver and destroy an ever growing horde of chess enemies. Go wishlist the game at https://store.steampowered.com/app/2065000/Chess_Survivors/ !`;
					break;
				case 'joxonman':
					response += ` Joxon is an amazing Fantasy Artist, you can see his portfolio at https://darkojovanov.artstation.com/ !`;
					break;
				case 'dev_spajus':
					response += ` ${streamer} has released Stardeus: a sci-fi colony management simulator with aspects of automation, base building and space exploration. Go wishlist the game at https://store.steampowered.com/app/1380910/Stardeus/ !`;
					break;
				case 'jotson':
					response += ` ${streamer} has released Gravity Ace: a 2D multi-directional gravity shooter (cave-flyer). Go wishlist the game at https://store.steampowered.com/app/1003860/Gravity_Ace/ !`;
					break;
				case 'RedCabinGames':
					response += ` ${streamer} is working on releasing Space Scavenger 2: an Action-Roguelike where you scavenge for modules to build a hodgepodge spaceship. Go wishlist the game at https://store.steampowered.com/app/1962010/Space_Scavenger_2/ !`;
					break;
				case 'Lentsius':
					response += ` ${streamer} is working on releasing Cardbob: explore the sci-fi dungeons, collect loot, and negotiate the highest prices in this action roguelite, set in a 3D cardboard world. Go wishlist the game at https://store.steampowered.com/app/1963670/Cardbob/ !`;
					break;
				case 'GrumbleOfPugz':
					response += ` ${streamer} is working on releasing Megabat: a simple action puzzle game where you control a fruit bat to collect fruit. Go play the prototype at https://pugdev.itch.io/megabat !`;
					break;
				case 'moonfassa':
					response += ` ${streamer} is a competitive Faeria streamer and content creator. Check out also his Youtube channel at https://www.youtube.com/c/Moonfassa !`
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
	//commands with no arguments
	if(!success) {
		switch(cmd) {
			case '!bot':
				seshbot.say(channel, `[seshbot] General commands: !bot, !itch, !game, !jam, !discord, !tts <text>. Faeria commands: !tournament, !players.`);
				success = true;
				break;
			case '!itch':
				seshbot.say(channel, `[seshbot] Check out my itch.io page at https://seshoumara.itch.io !`);
				success = true;
				break;
			case '!game':
				seshbot.say(channel, `[seshbot] Low Level Hero is a programming-puzzle game with only two commands: copy-paste and search-replace. Go play the demo at https://seshoumara.itch.io/low-level-hero !`);
				success = true;
				break;
			case '!jam':
				seshbot.say(channel, `[seshbot] Check out the 10 days Linux Game Jam 2023 at https://itch.io/jam/linux-game-jam2023 !`);
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
	//commands with arguments
	if(!success) {
		if(cmd.startsWith('!tts ')) {
                        var spoken_message = cmd.slice(5);
			//my attempt at working around code injection, not sure if it's sufficient
			spoken_message = spoken_message.replace(/'/g, '');
			cmd = '!tts ' + spoken_message;
			if(spoken_message.length <= max_TTS_msg_length) {
				exec("echo -E -- '" + spoken_message + "'|cut -c4-|festival --tts");
				console.log("TTS execution in progress ...");
			}
			else {
				skipped = true;
			}
			success = true;
		}
	}
	log_command(tags.username, cmd, success, skipped);
}

function get_upcoming_Faeria_tournament() {
	//TODO: use Battlefy API to automate getting the upcoming Faeria tournament, if any!
	var tournament = {
		ID: "6369738d402e87582ffd5b73",
		name: "Seifer Open #2",
		date: "Saturday, November 26th",
		time: "18:00 CET",
		link: "https://battlefy.com/abrakam-entertainment/seifer-open-2-2022/6369738d402e87582ffd5b73/info",
		valid: false	//to be removed if tournament gathering is automated!
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
