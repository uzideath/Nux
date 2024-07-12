import { SapphireClient, LogLevel, container } from "@sapphire/framework";
import { getRootData } from "@sapphire/pieces";
import { ActivityType, GatewayIntentBits, Partials } from "discord.js";
import { Kazagumo, Plugins } from "kazagumo";
import { Connectors } from 'shoukaku';
import config from "../config";
import { join } from "path";

export class Client extends SapphireClient {
    private rootData = getRootData();
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
            presence: {
                activities: [
                    {
                        name: 'You.',
                        type: ActivityType.Listening
                    }
                ],
                status: 'idle'
            },
            loadMessageCommandListeners: true
        });
        this.stores.get('listeners').registerPath(join(this.rootData.root, 'events'));
    }

    public override login(token?: string) {
        container.kazagumo = new Kazagumo({
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
