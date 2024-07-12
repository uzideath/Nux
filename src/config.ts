import { envParseString } from "@skyra/env-utilities";

export default {
    Nodes: [{
        name: envParseString('LAVALINK_NAME'),
        url: envParseString('LAVALINK_URL'),
        auth: envParseString('LAVALINK_AUTH'),
        secure: false
    }],
    Icons: {
        Bot: 'https://i.pinimg.com/736x/e2/48/cf/e248cffd8b8c0fc9542d9ac71179b9fe.jpg',
        Check: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/600px-Sign-check-icon.png',
        Playing: 'https://cdn.darrennathanael.com/icons/spinning_disk.gif',
        Loading: 'https://cdn3.emoji.gg/emojis/43294-youtube-loading-circle.gif'
    },
    emojis: {
        check: '<:accepted:1083594549575823430>',
        warn: '<:cattowarn:1109936311399350433>'
    }
};
