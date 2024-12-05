import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Play a track in your voice channel!',
    aliases: ['p'],
    options: [
        {
            name: 'track',
            description: 'The name or URL of the track to play.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async commandRun(interaction) {
        await interaction.deferReply();
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const userVoiceChannel = member?.voice.channel?.id;

            if (!userVoiceChannel) {
                return interaction.editReply({
                    content: 'You need to be in a voice channel to use this command.',
                });
            }

            const trackQuery = interaction.options.getString('track', true);
            const { client } = interaction;
            const poru = client.poru;

            const res = await poru.resolve({
                query: trackQuery,
                source: 'ytsearch',
                requester: interaction.user,
            });

            if (res.loadType === 'error') {
                return interaction.editReply({
                    content: 'There was an error loading the track. Please try again.',
                });
            }

            if (res.loadType === 'empty') {
                return interaction.editReply({
                    content: 'No tracks found for your query.',
                });
            }

            let player = poru.players.get(interaction.guild!.id);

            if (player) {
                if (player.voiceChannel) {
                    if (player.voiceChannel !== userVoiceChannel) {
                        return interaction.editReply({
                            content: 'I am already connected to a different voice channel.',
                        });
                    }
                } else {
                    player.destroy();
                }
            }

            if (!player) {
                player = poru.createConnection({
                    guildId: interaction.guild!.id,
                    voiceChannel: userVoiceChannel,
                    textChannel: interaction.channel!.id,
                    deaf: true,
                });
            }

            if (res.loadType === 'playlist') {
                for (const track of res.tracks) {
                    track.info.requester = interaction.user;
                    player.queue.add(track);
                }

                interaction.editReply({
                    content: `Playlist \`${res.playlistInfo.name}\` loaded with \`${res.tracks.length}\` tracks.`,
                });
            } else {
                const track = res.tracks[0];
                track.info.requester = interaction.user;
                player.queue.add(track);

                interaction.editReply({
                    content: `Queued: \`${track.info.title}\`.`,
                });
            }

            if (!player.isPlaying && !player.isPaused) {
                player.play();
            }

        } catch (error) {
            console.error('Error in commandRun:', error);
            return interaction.editReply({
                content: 'An error occurred while processing your request. Please try again later.',
            });
        }
    },

    async messageRun(message) {
        try {
            const args = message.content.split(' ').slice(1);
            if (!args.length) {
                return message.channel.send('Please provide the name or URL of the track to play.');
            }

            const trackQuery = args.join(' ');
            const voiceChannel = message.member?.voice.channel;

            if (!voiceChannel) {
                return message.channel.send('You need to be in a voice channel to use this command.');
            }

            const poru = message.client.poru;

            const res = await poru.resolve({
                query: trackQuery,
                source: 'ytsearch',
                requester: message.author,
            });

            if (res.loadType === 'error') {
                return message.channel.send('There was an error loading the track. Please try again.');
            }

            if (res.loadType === 'empty') {
                return message.channel.send('No tracks found for your query.');
            }

            let player = poru.players.get(message.guild!.id);

            if (player) {
                if (player.voiceChannel) {
                    if (player.voiceChannel !== voiceChannel.id) {
                        return message.channel.send('I am already connected to a different voice channel.');
                    }
                } else {
                    player.destroy();
                }
            }

            if (!player) {
                player = poru.createConnection({
                    guildId: message.guild!.id,
                    voiceChannel: voiceChannel.id,
                    textChannel: message.channel.id,
                    deaf: true,
                });
            }

            if (res.loadType === 'playlist') {
                for (const track of res.tracks) {
                    track.info.requester = message.author;
                    player.queue.add(track);
                }

                message.channel.send(
                    `Playlist \`${res.playlistInfo.name}\` loaded with ${res.tracks.length} tracks.`
                );
            } else {
                const track = res.tracks[0];
                track.info.requester = message.author;
                player.queue.add(track);

                message.channel.send(`Queued: \`${track.info.title}\`.`);
            }

            if (!player.isPlaying && !player.isPaused) {
                player.play();
            }

        } catch (error) {
            console.error('Error in messageRun:', error);
            return message.channel.send('An error occurred while processing your request. Please try again later.');
        }
    },
});
