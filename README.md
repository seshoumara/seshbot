# seshbot

Custom Twitch chat bot written in Node.js, for personal use.

## Available commands:

- general: !bot, !itch, !LLH, !jam, !discord
- text to speech: !tts <test>
- Faeria: !tournament, !players
- Twitch (restricted): !so <streamer>, !raid <streamer>

## Screenshots:

**seshbot** running on Linux server

![seshbot server](https://raw.githubusercontent.com/seshoumara/seshbot/main/Screenshots/seshbot_CLI.png)

**seshbot** usage in my Twitch chat

![seshbot Twitch](https://raw.githubusercontent.com/seshoumara/seshbot/main/Screenshots/seshbot_Twitch.png)

### Known issues:

- the festival command called by !tts breaks down on my new Ubuntu system, no sound is played
- node_modules folder shouldn't be in the repo, but .gitignore is refusing to obey
