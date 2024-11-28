import { Listener } from '#lib/structures';

export default new Listener({
    event: 'trackStart',
    async run(player, track, client) {
        const channel = client.channels.cache.get(player.textChannel);
        if (channel && channel.isTextBased()) {
            try {
                await channel.send(`Now playing: \`${track.info.title}\``);
            } catch (error) {
                client.logger.error(
                    `Failed to send message to channel ${player.textChannel}: ${(error as Error).message}`
                );
            }
        } else {
            client.logger.warn(
                `Text channel for player in guild ${player.guildId} not found or invalid.`
            );
        }
    },
});
