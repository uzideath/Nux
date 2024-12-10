import { PoruOptions } from 'poru';

const config: ConfigType = {
	nodes: [
		{
			name: process.env.LAVALINK_NAME || 'self',
			host: process.env.LAVALINK_HOST || '',
			port: Number(process.env.LAVALINK_PORT) || 2333,
			password: process.env.LAVALINK_PASSWORD || '',
		},
	],
	options: {
		library: 'discord.js',
		defaultPlatform: 'ytsearch',
	},
	bot: {
		owners: [],
		prefix: process.env.PREFIX ? process.env.PREFIX.split(',') : ['.'],
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: Number(process.env.REDIS_PORT) || 6379,
		password: process.env.REDIS_PASSWORD || '',
	},
};

interface Conf {
	nodes: [
		{
			name: string;
			host: string;
			port: number;
			password: string;
		},
	];
	options: PoruOptions;
	bot: {
		prefix: string[];
		owners: [];
	};
	redis: {
		host: string; // Redis host
		port: number; // Redis port
		password: string; // Redis password
	};
}

type ConfigType = Conf;

export default config;
