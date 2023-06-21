const allowed_users = [ "seshoumara" ];

const streamers = {
    "seshoumara":
        `is working on releasing Low Level Hero: a programming-puzzle game with only two commands, copy-paste and search-replace. Try the game at https://seshoumara.itch.io/low-level-hero !`,
    "dev_spajus":
        `has released Stardeus: a sci-fi colony management simulator with aspects of automation, base building and space exploration. Go wishlist the game at https://store.steampowered.com/app/1380910/Stardeus/ !`,
    "jotson":
        `has released Gravity Ace: a 2D multi-directional gravity shooter (cave-flyer). Go wishlist the game at https://store.steampowered.com/app/1003860/Gravity_Ace/ !`,
    "MrEliptik":
        `has released Dashpong: a high energy arcade local multiplayer game. Dash around the map, create paddles to defend your goal and shoot the ball at your opponent to score. Go wishlist the game at https://store.steampowered.com/app/1729250/Dashpong/ !`,
    "Aarimous":
        `has released Chess Survivors: a grid based, quick-turn, roguelike where you outmaneuver and destroy an ever growing horde of chess enemies. Go wishlist the game at https://store.steampowered.com/app/2065000/Chess_Survivors/ !`,
    "Lentsius":
        `is working on releasing Cardbob: explore the sci-fi dungeons, collect loot, and negotiate the highest prices in this action roguelite, set in a 3D cardboard world. Go wishlist the game at https://store.steampowered.com/app/1963670/Cardbob/ !`,
    "GrumbleOfPugz":
        `is working on releasing Megabat: a pixel art 2D "platformer" passion project, with an emphasis on using different abilities to enhance your movement. Go wishlist the game at https://store.steampowered.com/app/2429230/Megabat/ !`,
    "B4zzzing":
        `is working on releasing Old Bones: take on the role of a young carpenter apprentice who has just arrived on a remote island inhabited by a group of former pirates. Try the game at https://b4zzzing.itch.io/old-bones !`,
    "RedCabinGames":
        `is working on releasing Space Scavenger 2: an Action-Roguelike where you scavenge for modules to build a hodgepodge spaceship. Go wishlist the game at https://store.steampowered.com/app/1962010/Space_Scavenger_2/ !`,
    "moonfassa":
        `is a competitive Faeria streamer and content creator. Check out also his Youtube channel at https://www.youtube.com/c/Moonfassa !`,
    "joxonman":
        `is an amazing Fantasy Artist, you can see his portfolio at https://darkojovanov.artstation.com/ !`
};

async function execute_so(username, command, streamer) {
    if(!(allowed_users.includes(username))) {
        command["skipped"] = true;
        return;
    }
    command["Twitch_cmd"] += " " + streamer;
    command["message"] = "Check out " + streamer + " and follow his stream at https://www.twitch.tv/" + streamer + " !";
    if(!(streamer in streamers)) {
        return;
    }
    command["message"] += " " + streamer + " " + streamers[streamer];
}

async function execute_raid(username, command, streamer) {
    await execute_so(username, command, streamer);
}

module.exports = {
	execute_so: execute_so,
	execute_raid: execute_raid
};
