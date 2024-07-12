import { SapphireClient, LogLevel, container } from "@sapphire/framework";
import { GatewayIntentBits, Partials } from "discord.js";
import { Kazagumo, Plugins } from "kazagumo";
import { Connectors } from 'shoukaku';
import config from "../config";

export class Client extends SapphireClient {
    constructor() {
        super({
            defaultPrefix: '!',
            regexPrefix: /^(hey +)?bot[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Debug
            },
            shards: 'auto',
            intents: [
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ],
            partials: [Partials.Channel],
            loadMessageCommandListeners: true
        });
    }

    public override login(token?: string) {
        container.Kazagumo = new Kazagumo({
            defaultSearchEngine: "youtube",
            send: (guildId, payload) => {
                const guild = this.guilds.cache.get(guildId);
                if (guild) guild.shard.send(payload);
            },
            plugins: [new Plugins.PlayerMoved(this)]
        }, new Connectors.DiscordJS(this), config.Nodes);

        return super.login(token);
    }
}

export const client = new Client();
