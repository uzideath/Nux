import { envParseString } from "@skyra/env-utilities";
import { ActivityType } from "discord.js";
import { ConfigType } from "./types";

const config: ConfigType = {
    Bot: {
        prefix: "!",
        searchEngine: "youtube",
        inactivity: 5,  // Minutes
        presence: {
            name: "Your thoughts.",
            type: ActivityType.Listening,
            status: "idle"
        }
    },
    Nodes: [{
        name: envParseString('LAVALINK_NAME'),
        url: envParseString('LAVALINK_URL'),
        auth: envParseString('LAVALINK_AUTH'),
        secure: false
    }],
    Icons: {
        Bot: 'https://media1.tenor.com/m/U5qzaBC8PtgAAAAC/anime-alya.gif',
        Check: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/600px-Sign-check-icon.png',
        Error: 'https://cdn3.emoji.gg/emojis/6426-error.png',
        Playing: 'https://cdn.darrennathanael.com/icons/spinning_disk.gif',
        Loading: 'https://cdn3.emoji.gg/emojis/43294-youtube-loading-circle.gif',
        Youtube: 'https://cdn3.emoji.gg/emojis/17807-youtube.png',
        Spotify: 'https://cdn3.emoji.gg/emojis/2320-spotify.png'
    },
    emojis: {
        check: '<:accepted:1083594549575823430>',
        warn: '<:cattowarn:1109936311399350433>',
        error: '<a:cattonope:1078929462290292756>'
    }
};

export default config;