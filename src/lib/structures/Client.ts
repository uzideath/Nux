import { handleListener, handleRegistry, initiateCommands } from '#core';
import { LogLevel } from '#lib/enums';
import { Command, Listener, Logger } from '#lib/structures';
import { Client as DJSClient, Collection, GatewayIntentBits, Partials, ActivityType, TextChannel } from 'discord.js';
import { cyanBright, underline } from 'colorette';
import config from '#root/config';
import { Poru } from 'poru';

export class Client<Ready extends boolean = true> extends DJSClient<Ready> {
	public poru: Poru
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates
			],
			partials: [Partials.Channel],
			presence: {
				status: 'dnd', // ! Set your bot's status (online, dnd, idle, invisible)
				activities: [
					{
						name: '/play', // ! Set your bot's activity
						type: ActivityType.Watching,
					},
				],
			},
		});

		this.logger.setLevel(LogLevel.Debug);
		this.prefixes = ['q!', '!']; //! Set your preferable prefix
		this.ownerIds = ['917620752453369896']; //! Set your Discord User ID
		this.restDebug = false; //! Set this to true if you want to see REST logs

		this.poru = new Poru(this, config.nodes, config.options)

		this.poru.on("trackStart", (player, track) => {
			const channel = this.channels.cache.get(player.textChannel) as TextChannel;
			return channel.send(`Now playing \`${track.info.title}\``);
		});
	}

	public prefixes: string[] = [];

	public ownerIds: string[] = [];

	public commands = new Collection<string, Command>();

	public listener = new Collection<string, Listener>();

	public logger: Logger = new Logger();

	public override async login(token?: string | undefined): Promise<string> {
		await Promise.all([handleRegistry(this as Client), handleListener(this as Client)]);

		const promiseString = await super.login(token);
		this.logger.info(`Logged in as ${cyanBright(underline(`${this.user?.tag}`))}`);
		this.poru.init()
		await initiateCommands(this as Client, {
			register: false,
			sync: false,
			shortcut: true,
		});

		return promiseString;
	}
}

declare module 'discord.js' {
	interface Client {
		ownerIds: string[];
		commands: Collection<string, Command>;
		listener: Collection<string, Listener>;
		logger: Logger;
		prefixes: string[];
		restDebug: boolean;
		poru: Poru;
	}
}
