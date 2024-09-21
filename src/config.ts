import { envParseString } from "@skyra/env-utilities";
import { ActivityType } from "discord.js";
import { ConfigType } from "./types";

const config: ConfigType = {
    bot: {
        prefix: "!",
        searchEngine: "youtube",
        inactivity: 5,  // Minutes
        presence: {
            name: "Your thoughts.",
            type: ActivityType.Listening,
            status: "idle"
        }
    },
    nodes: [{
        name: envParseString('LAVALINK_NAME'),
        url: envParseString('LAVALINK_URL'),
        auth: envParseString('LAVALINK_AUTH'),
        secure: false
    }],
    icons: {
        bot: 'https://i.imgur.com/MmPlPMF.gif',
        check: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/600px-Sign-check-icon.png',
        error: 'https://cdn3.emoji.gg/emojis/6426-error.png',
        playing: 'https://cdn3.emoji.gg/emojis/6115-dance.gif',
        loading: 'https://cdn3.emoji.gg/emojis/43294-youtube-loading-circle.gif',
        youtube: 'https://cdn3.emoji.gg/emojis/17807-youtube.png',
        spotify: 'https://cdn3.emoji.gg/emojis/2320-spotify.png'
    },
    emojis: {
        check: '<:accepted:1083594549575823430>',
        warn: '<:cattowarn:1109936311399350433>',
        error: '<a:cattonope:1078929462290292756>'
    }
};

export default config;