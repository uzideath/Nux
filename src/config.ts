import { PoruOptions } from "poru"

const config: ConfigType = {
    nodes:
        [
            {
                name: process.env.LAVALINK_NAME || "self",
                host: process.env.LAVALINK_HOST,
                port: Number(process.env.LAVALINK_PORT),
                password: process.env.LAVALINK_PASSWORD,
            },
        ],
    options:
    {
        library: "discord.js",
        defaultPlatform: "ytsearch",
    },
    bot: {
        owners: [],
        prefix: ['.']
    }
}


interface Conf {
    nodes: [
        {
            name: string;
            host: string;
            port: number;
            password: string;
        }
    ],
    options: PoruOptions,

    bot: {
        prefix: ['.'],
        owners: []
    }
}

type ConfigType = Conf

export default config