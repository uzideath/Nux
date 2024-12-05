import { Redis } from 'ioredis';
import { CommandType } from '#lib/enums';
import { AddUndefinedToPossiblyUndefinedPropertiesOfInterface } from 'discord-api-types/utils/internals';
import {
	ApplicationCommandOptionData,
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	Message,
	MessageContextMenuCommandInteraction,
	PermissionResolvable,
	UserContextMenuCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	APIApplicationCommandOption,
	ApplicationCommandType,
	Awaitable,
} from 'discord.js';
import { Client } from './Client';

export class Command<T extends CommandType = CommandType> {
	private data: CommandOptions<T>;
	public description?: string;
	public type: CommandType;
	public guildIds: string[] = [];
	public options?: ApplicationCommandOptionData[] = [];
	public permissions?: PermissionResolvable | null;
	public runInDM?: boolean;
	public aliases?: string[];
	public ownerOnly?: boolean;
	public cooldown?: number;
	public commandRun?: (interaction: RunType[T]) => Awaitable<unknown>;
	public messageRun?: (
		message: Message<boolean>,
		args: string[]
	) => Awaitable<unknown>;
	public autoCompleteRun?: (
		interaction: AutocompleteInteraction
	) => Awaitable<unknown>;

	private static redisClient: Redis;

	public constructor(data: CommandOptions<T>) {
		this.data = data;
		this.type = data.type;
		this.aliases = data.aliases ?? [];
		this.commandRun = data.commandRun as
			| ((interaction: RunType[T]) => Promise<unknown>)
			| undefined;
		this.messageRun = data.messageRun;
		this.autoCompleteRun = data.autoCompleteRun;
		this.permissions = data.defaultMemberPermissions ?? null;
		this.runInDM = data.dmPermission;
		this.ownerOnly = data.ownerOnly;
		this.cooldown = data.cooldown ?? 0;

		if (data.type === CommandType.ChatInput) {
			this.description = (data as ChatInputCommandOptions).description;
			this.options = (data as ChatInputCommandOptions).options;
		}

		this.guildIds = this.data.guildIds ?? []; // Keep it empty for global commands
	}

	public static initialize(client: Client): void {
		this.redisClient = client.redis;
		console.log('[Command] Redis client initialized.'); // Add this debug log
	}

	public static getRedisClient(): Redis {
		if (!this.redisClient) {
			throw new Error('Redis client is not set. Use Command.initialize(client) to set it.');
		}
		return this.redisClient;
	}

	public set name(name: string) {
		this.data.name = this.data.name ?? name;
	}

	public get name(): string {
		if (!this.data.name) throw new Error('Command name is not set');
		return this.data.name;
	}

	public buildAPIApplicationCommand(): RESTPostAPIChatInputApplicationCommandsJSONBody {
		return {
			name: this.data.name!,
			description: this.description ?? '',
			default_member_permissions: this.permissions?.toString(),
			dm_permission: this.runInDM,
			options: this
				.options as AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
					APIApplicationCommandOption[]
				>,
			type: this
				.type as unknown as AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
					ApplicationCommandType.ChatInput | undefined
				>,
		};
	}

	/**
	 * Checks if the user is on cooldown and sets it if not.
	 * @param userId User ID
	 * @param guildId Guild ID
	 * @returns True if the user is on cooldown, false otherwise
	 */
	public async checkCooldown(userId: string, guildId: string): Promise<boolean> {
		console.log(`[Cooldown] Checking cooldown for user: ${userId}, guild: ${guildId}`); // Debug log
		const redis = Command.getRedisClient();
		const key = `cooldown:${this.name}:${guildId}:${userId}`;
		const isOnCooldown = await redis.exists(key);
	
		if (isOnCooldown) {
			const ttl = await redis.ttl(key);
			console.log(`[Cooldown] Key exists. Remaining TTL: ${ttl}`); // Debug log
			return true;
		}
	
		if (this.cooldown && this.cooldown > 0) {
			console.log(`[Cooldown] Setting key: ${key} with expiration: ${this.cooldown}`); // Debug log
			await redis.set(key, '1', 'EX', this.cooldown);
		}
	
		return false;
	}
	


	/**
	 * Retrieves the remaining cooldown time for the user.
	 * @param userId User ID
	 * @param guildId Guild ID
	 * @returns Remaining time in seconds
	 */
	public async getCooldown(userId: string, guildId: string): Promise<number> {
		const redis = Command.getRedisClient();
		const key = `cooldown:${this.name}:${guildId}:${userId}`;
		const ttl = await redis.ttl(key);
		return ttl > 0 ? ttl : 0;
	}
}

interface BaseCommandOptions<T extends CommandType> {
	type: T;
	name?: string;
	aliases?: string[];
	description?: string;
	cooldown?: number;
	defaultMemberPermissions?: PermissionResolvable;
	ownerOnly?: boolean;
	commandRun?: (interaction: RunType[T]) => Awaitable<unknown>;
	messageRun?: (message: Message<boolean>, args: string[]) => Awaitable<unknown>;
	autoCompleteRun?: T extends CommandType.ChatInput
	? (interaction: AutocompleteInteraction) => Awaitable<unknown>
	: never;
}

interface ChatInputCommandOptions
	extends BaseCommandOptions<CommandType.ChatInput> {
	description: string;
	options?: ApplicationCommandOptionData[];
	type: CommandType.ChatInput;
}

interface GlobalCommand {
	dmPermission?: false;
	guildIds?: never;
}

interface GuildCommand {
	dmPermission?: never;
	guildIds?: NonEmptyArray;
}

type CommandOptions<T extends CommandType> = T extends CommandType.ChatInput
	? ChatInputCommandOptions & BaseCommand
	: T extends CommandType.Legacy
	? BaseCommandOptions<T> &
	Required<Pick<BaseCommandOptions<T>, 'messageRun'>> &
	BaseCommand
	: BaseCommandOptions<T> &
	Required<Pick<BaseCommandOptions<T>, 'commandRun'>> &
	BaseCommand;

type BaseCommand = GuildCommand | GlobalCommand;

type NonEmptyArray<T extends string = string> = [T, ...T[]];

interface RunType {
	[CommandType.ChatInput]: ChatInputCommandInteraction;
	[CommandType.Message]: MessageContextMenuCommandInteraction;
	[CommandType.User]: UserContextMenuCommandInteraction;
	[CommandType.Legacy]: never;
}
