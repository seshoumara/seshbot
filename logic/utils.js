function get_raw_command(message) {
    var raw_command = message.trim();
    raw_command = raw_command.replace(/'/g, '');
    raw_command = raw_command.replace(/"/g, '');
    return raw_command;
}

function log_command(username, command, is_matched, is_skipped) {
	var state = "Executed";
	if(is_skipped) {
		state = "Skipped";
	}
	if(!is_matched) {
		state = "Unknown";
	}
	console.log("* " + state + " command: " + command + " (" + username + ")");
}

module.exports = {
	get_raw_command: get_raw_command,
    log_command: log_command
};
