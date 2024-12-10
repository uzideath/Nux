declare module 'bun' {
	interface Env {
		DISCORD_TOKEN: string;
		TEST_SERVER_ID: string;
		LAVALINK_HOST: string;
		LAVALINK_PORT: number;
		LAVALINK_PASSWORD: string;
	}
}
