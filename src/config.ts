import { PoruOptions } from "poru"

const config: ConfigType = {
    nodes:
        [
            {
                name: "local-node",
                host: process.env.LAVALINK_HOST,
                port: Number(process.env.LAVALINK_PORT),
                password: process.env.LAVALINK_PASSWORD,
            },
        ],
    options:
    {
        library: "discord.js",
        defaultPlatform: "scsearch",
    }
}


interface Conf {
    nodes: [{
        name: string;
        host: string;
        port: number;
        password: string;
    }],
    options: PoruOptions
}

type ConfigType = Conf

export default config