import { ActivityType, PresenceStatusData } from "discord.js";

interface BotConfig {
    prefix: string;
    searchEngine: string;
    inactivity: number;
    presence: {
        name: string;
        type: ActivityType;
        status: PresenceStatusData;
    };
}

interface NodeConfig {
    name: string;
    url: string;
    auth: string;
    secure: boolean;
}

interface IconsConfig {
    Bot: string;
    Check: string;
    Playing: string;
    Loading: string;
    Youtube: string;
    Spotify: string;
}

interface EmojisConfig {
    check: string;
    warn: string;
}

interface Config {
    Bot: BotConfig;
    Nodes: NodeConfig[];
    Icons: IconsConfig;
    emojis: EmojisConfig;
}

export type ConfigType = Config;