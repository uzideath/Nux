import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Autoplaying new music!',
    aliases: ['ap'],

    async commandRun(interaction) {
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const voiceChannel = member?.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({
                    content: 'You need to be in a voice channel to use this command.',
                    ephemeral: true,
                });
            }

            const player = interaction.client.poru.players.get(interaction.guild!.id);
            if (!player) {
                return interaction.reply({
                    content: 'There is no active player for this server.',
                    ephemeral: true,
                });
            }

            try {
                const data = `https://www.youtube.com/watch?v=${player.previousTrack?.info?.identifier || player.currentTrack?.info?.identifier}&list=RD${player.previousTrack?.info.identifier || player.currentTrack?.info.identifier}`;

                const response = await player.poru.resolve({
                    query: data,
                    requester: player.previousTrack?.info?.requester ?? player.currentTrack?.info?.requester,
                    source: player.previousTrack?.info?.sourceName ?? player.currentTrack?.info?.sourceName ?? player.poru.options?.defaultPlatform ?? "ytmsearch",
                });

                if (!response || !response.tracks || ["error", "empty"].includes(response.loadType)) {
                    return await player.skip();
                }

                response.tracks.shift();

                const track = response.tracks[Math.floor(Math.random() * response.tracks.length)];
                player.queue.push(track);

                if (!player.isPlaying) {
                    await player.play();
                }

                player.isAutoPlay = true;

                return interaction.reply('<a:DancingChristmasPepe:1311733132285837373>');
            } catch (e) {
                console.error('Error while resolving tracks:', e);
                return await player.skip();
            }
        } catch (error) {
            console.error('Error in commandRun:', error);
            return interaction.reply({
                content: 'An error occurred while executing the command. Please try again later.',
                ephemeral: true,
            });
        }
    },

    async messageRun(message) {
        try {
            const voiceChannel = message.member?.voice.channel;

            if (!voiceChannel) {
                return message.channel.send('You need to be in a voice channel to use this command.');
            }

            const player = message.client.poru.players.get(message.guild!.id);
            if (!player) {
                return message.channel.send('There is no active player for this server.');
            }

            // Autoplay logic
            try {
                const data = `https://www.youtube.com/watch?v=${player.previousTrack?.info?.identifier || player.currentTrack?.info?.identifier}&list=RD${player.previousTrack?.info.identifier || player.currentTrack?.info.identifier}`;

                const response = await player.poru.resolve({
                    query: data,
                    requester: player.previousTrack?.info?.requester ?? player.currentTrack?.info?.requester,
                    source: player.previousTrack?.info?.sourceName ?? player.currentTrack?.info?.sourceName ?? player.poru.options?.defaultPlatform ?? "ytmsearch",
                });

                if (!response || !response.tracks || ["error", "empty"].includes(response.loadType)) {
                    return await player.skip();
                }

                response.tracks.shift();

                const track = response.tracks[Math.floor(Math.random() * response.tracks.length)];
                player.queue.push(track);

                if (!player.isPlaying) {
                    await player.play();
                }

                player.isAutoPlay = true;

                return message.channel.send('<a:DancingChristmasPepe:1311733132285837373>');
            } catch (e) {
                console.error('Error while resolving tracks:', e);
                return await player.skip();
            }
        } catch (error) {
            console.error('Error in messageRun:', error);
            return message.channel.send('An error occurred while executing the command. Please try again later.');
        }
    },
});
