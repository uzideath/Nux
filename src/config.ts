import { envParseString } from "@skyra/env-utilities";

export default {
    Nodes: [{
        name: envParseString('LAVALINK_NAME'),
        url: envParseString('LAVALINK_URL'),
        auth: envParseString('LAVALINK_AUTH'),
        secure: false
    }]
};
