const commands = require("./logic/commands.js");
const utils = require("./logic/utils.js");

async function test_general_commands(username) {
    console.log(await commands.get_matching_command(username, "!bot"));
    console.log(await commands.get_matching_command(username, "!itch"));
    console.log(await commands.get_matching_command(username, "!LLH"));
    console.log(await commands.get_matching_command(username, "!jam"));
    console.log(await commands.get_matching_command(username, "!discord"));
}

async function test_tts_command(username, tts_message) {
    console.log(await commands.get_matching_command(username, "!tts " + tts_message));
    await utils.sleep(20000);
}

async function test_Faeria_commands(username, test_players) {
    console.log(await commands.get_matching_command(username, "!tournament"));
    await utils.sleep(60000);
    if(test_players)
        console.log(await commands.get_matching_command(username, "!players"));
    await utils.sleep(60000);
}

async function test_streamer_commands(username, streamer) {
    console.log(await commands.get_matching_command(username, "!so " + streamer));
    console.log(await commands.get_matching_command(username, "!raid " + streamer));
}

async function test_blind_command(username, command) {
    console.log(await commands.get_matching_command(username, command));
    //TODO: check if command is a tts or a Faeria one and apply sleep if so
}

async function main() {
    commands.register_all_commands();
    console.log("Starting tests ...\n");
    await test_general_commands("seshoumara");
    //await test_general_commands("jotson");
    //await test_tts_command("seshoumara", "this is working");
    //await test_tts_command("seshoumara" ,"123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102103104105106107108109110111");
    //await test_tts_command("jotson", "this is working");
    //await test_Faeria_commands("seshoumara", false);
    //await test_Faeria_commands("seshoumara", true);
    //await test_Faeria_commands("jotson", false);
    //await test_streamer_commands("seshoumara", "jotson");
    //await test_streamer_commands("seshoumara", "x");
    //await test_streamer_commands("jotson", "jotson");
    //await test_streamer_commands("jotson", "x");
    //await test_blind_command("seshoumara", "!raid jotson");
    //await test_blind_command("seshoumara", "!commands");
    console.log("\nTests finished!");
}

main();
