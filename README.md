# seshbot

Custom Twitch chat bot written in Node.js, for personal use.

## Available commands:

- static: !itch, !LLH, !discord (stored not in code but in JSON file, to edit/add new ones much easier)
- automatic: !bot
- Twitch (restricted): !so <streamer>, !raid <streamer> (streamer data stored not in code but in JSON file, to edit it much easier)

There's also the ability to hide commands, not just from !bot output but also from recognizing and executing them.

## Screenshots:

**seshbot** running on Linux server

![seshbot server](https://raw.githubusercontent.com/seshoumara/seshbot/main/Screenshots/seshbot_CLI.png)

**seshbot** usage in my Twitch chat

![seshbot Twitch](https://raw.githubusercontent.com/seshoumara/seshbot/main/Screenshots/seshbot_Twitch.png)

### Known issues:

- the festival command called by !tts breaks down on my new Ubuntu system, no sound is played (command hidden for now)
