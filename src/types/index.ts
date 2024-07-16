import { ActivityType, PresenceStatusData } from "discord.js";
import { KazagumoPlayer } from "kazagumo";

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
    Error: string;
    Playing: string;
    Loading: string;
    Youtube: string;
    Spotify: string;
}

interface EmojisConfig {
    check: string;
    warn: string;
    error: string;
}

interface Config {
    Bot: BotConfig;
    Nodes: NodeConfig[];
    Icons: IconsConfig;
    emojis: EmojisConfig;
}

export type ConfigType = Config;

interface AlyaPlayer extends KazagumoPlayer {
    shuffleMode?: boolean;
}

export type AlyaPlayerType = AlyaPlayer;