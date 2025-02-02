import { handleListener, handleRegistry, initiateCommands } from '#core';
import { LogLevel } from '#lib/enums';
import { Command, Listener, Logger } from '#lib/structures';
import { Client as DJSClient, Collection, GatewayIntentBits, Partials, ActivityType, TextChannel } from 'discord.js';
import { cyanBright, underline } from 'colorette';
import config from '#root/config';
import { Poru } from 'poru';
import { minutesToMilliseconds } from '#lib/util';

export class Client<Ready extends boolean = true> extends DJSClient<Ready> {
	public poru: Poru;
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildVoiceStates,
			],
			partials: [Partials.Channel],
			presence: {
				status: 'dnd',
				activities: [
					{
						name: '/play',
						type: ActivityType.Listening,
					},
				],
			},
		});

		this.logger.setLevel(LogLevel.Debug);
		this.prefixes = config.bot.prefix;
		this.ownerIds = [''];
		this.restDebug = false;

		this.poru = new Poru(this, config.nodes, config.options);

		this.registerPoruEvents();
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
		this.poru.init();
		await initiateCommands(this as Client, {
			register: false,
			sync: false,
			shortcut: true,
		});

		return promiseString;
	}
	private registerPoruEvents() {
		const disconnectTimers = new Map<string, NodeJS.Timeout>();

		this.poru.on('trackStart', (player, track) => {
			const channel = this.channels.cache.get(player.textChannel) as TextChannel;
			channel?.send(`Now playing \`${track.info.title}\``).catch(() => {
				this.logger.error(`Failed to send trackStart message to channel ${channel?.id}`);
			});

			if (disconnectTimers.has(player.guildId)) {
				clearTimeout(disconnectTimers.get(player.guildId)!);
				disconnectTimers.delete(player.guildId);
			}
		});

		this.poru.on('queueEnd', async (player) => {
			const channel = this.channels.cache.get(player.textChannel) as TextChannel;

			if (player.isAutoPlay) {
				try {
					await player.autoplay();
				} catch (error) {
					console.error('Error during autoplay:', error);
					channel?.send('An error occurred while attempting to autoplay. Stopping autoplay.').catch(() => {
						this.logger.error(`Failed to send autoplay message to channel ${channel?.id}`);
					});
				}
				return;
			}

			if (!player.isPlaying && player.queue.size === 0) {
				const disconnectTimer: NodeJS.Timeout = setTimeout(() => {
					if (!player.isPlaying && player.queue.size === 0) {
						player.destroy();
						channel?.send('I have been idle for 3 minutes. Cya 👋').catch(() => {
							this.logger.error(`Failed to send queueEnd idle message to channel ${channel?.id}`);
						});
						disconnectTimers.delete(player.guildId);
					}
				}, minutesToMilliseconds(3)) as NodeJS.Timeout;

				disconnectTimers.set(player.guildId, disconnectTimer);

				const onStatusChange = () => {
					if (player.isPlaying || player.queue.size > 0) {
						clearTimeout(disconnectTimer);
						disconnectTimers.delete(player.guildId);
						this.poru.off('playerUpdate', onStatusChange);
					}
				};

				this.poru.on('playerUpdate', onStatusChange);
			}
		});

		this.poru.on('nodeDisconnect', (node) => {
			this.logger.warn(`Node ${node.name} has been disconnected.`);
		});

		this.poru.on('nodeError', (node, error) => {
			this.logger.warn(`Node ${node.name} just fired an error: ${error}`);
		});

		this.poru.on('trackError', (player, track, error) => {
			const channel = this.channels.cache.get(player.textChannel) as TextChannel;
			console.error(`Track exception for ${track.info.title}: ${error}`);
			channel
				?.send(`An error occurred while playing \`${track.info.title}\`: ${error}. Skipping...`)
				.catch(() => {
					this.logger.error(`Failed to send trackError message to channel ${channel?.id}`);
				});
			player.destroy();
		});

		this.poru.on('playerCreate', (player) => {
			this.logger.info(`A new player was created on ${player.guildId}`);
		});

		this.poru.on('playerDestroy', (player) => {
			this.logger.info(`A player was destroyed on ${player.guildId}`);
		});

		this.poru.on('playerUpdate', (player) => {
			//	this.logger.info(`Player updated in guild: ${player.guildId}`);
		});

		this.poru.on('nodeConnect', (node) => {
			this.logger.debug(`Node ${node.name} connected successfully.`);
		});

		this.poru.on('nodeReconnect', (node) => {
			this.logger.info(`Node ${node.name} is reconnecting...`);
		});
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
