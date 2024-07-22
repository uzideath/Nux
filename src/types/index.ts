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
    bot: string;
    check: string;
    error: string;
    playing: string;
    loading: string;
    youtube: string;
    spotify: string;
}

interface EmojisConfig {
    check: string;
    warn: string;
    error: string;
}

interface Config {
    bot: BotConfig;
    nodes: NodeConfig[];
    icons: IconsConfig;
    emojis: EmojisConfig;
}

export type ConfigType = Config;

interface AlyaPlayer extends KazagumoPlayer {
    shuffleMode?: boolean;
}

export type AlyaPlayerType = AlyaPlayer;