const commands = require("./logic/commands.js");

function test_general_commands(username) {
    console.log(commands.get_matching_command(username, "!bot"));
    console.log(commands.get_matching_command(username, "!itch"));
    console.log(commands.get_matching_command(username, "!LLH"));
    console.log(commands.get_matching_command(username, "!jam"));
    console.log(commands.get_matching_command(username, "!discord"));
}

function test_tts_command(username, tts_message) {
    console.log(commands.get_matching_command(username, "!tts " + tts_message));
}

function test_Faeria_commands(username, test_players) {
    console.log(commands.get_matching_command(username, "!tournament"));
    if(test_players) {
        console.log(commands.get_matching_command(username, "!players"));
    }
}

function test_streamer_commands(username, streamer) {
    console.log(commands.get_matching_command(username, "!so " + streamer));
    console.log(commands.get_matching_command(username, "!raid " + streamer));
}

function test_blind_command(username, command) {
    var response = commands.get_matching_command(username, command);
    console.log(response);
    console.log("is null: " + (response == null));
}

function main() {
    commands.register_all_commands();
//     test_general_commands("seshoumara");
//     test_general_commands("seshoumara");
//     test_tts_command("seshoumara" ,"123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102103104105106107108109110111");
//     test_tts_command("seshoumara", "this is working");
//     test_Faeria_commands("seshoumara", false);
//     test_Faeria_commands("seshoumara", false);
//     test_streamer_commands("jotson", "jotson");
//     test_streamer_commands("jotson", "x");
//     test_streamer_commands("seshoumara", "jotson");
//     test_streamer_commands("seshoumara", "x");
//     test_blind_command("seshoumara", "!commands");
     test_blind_command("seshoumara", "!raid joxonman");
     //test_Faeria_commands("seshoumara", true);
}

main();
