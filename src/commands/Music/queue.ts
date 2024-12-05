import { CommandType } from '#lib/enums';
import { Command, Paginator } from '#lib/structures';
import { EmbedBuilder } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Displays the current queue of songs with pagination.',
    aliases: ['q'],
    cooldown: 10,
    async commandRun(interaction) {
        try {
            await interaction.deferReply();

            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const voiceChannel = member?.voice.channel?.id;

            if (!voiceChannel) {
                return interaction.followUp({
                    content: 'You need to be in a voice channel to use this command.',
                });
            }

            const { client } = interaction;
            const poru = client.poru;

            const player = poru.players.get(interaction.guild!.id);
            if (!player) {
                return interaction.followUp({
                    content: 'There is no active player in this server.',
                });
            }

            const currentTrack = player.currentTrack;
            const queueTracks = player.queue;

            if (!currentTrack && !queueTracks.length) {
                return interaction.followUp({
                    content: 'The queue is currently empty.',
                });
            }

            const tracks = queueTracks.map(
                (track, index) =>
                    `\`${index + 1}\` ➡️ **${track.info.title}** - ${track.info.requester.tag}`
            );

            const chunkSize = 10;
            const pages = [];

            for (let i = 0; i < tracks.length; i += chunkSize) {
                const chunk = tracks.slice(i, i + chunkSize);
                pages.push(
                    new EmbedBuilder()
                        .setAuthor({
                            name: `Now Playing: ${currentTrack?.info.title || 'Nothing'}`,
                            iconURL: 'https://cdn3.emoji.gg/emojis/71921-headphones.gif',
                        })
                        .setDescription(chunk.join('\n'))
                        .setFooter({ text: `Page ${Math.ceil((i + 1) / chunkSize)}/${Math.ceil(tracks.length / chunkSize)}` })
                        .setColor('Random')
                );
            }

            if (pages.length === 0) {
                return interaction.followUp({
                    content: 'There are no songs in the queue to display.',
                });
            }

            const paginator = new Paginator({ embeds: pages });
            return paginator.run(interaction);
        } catch (error) {
            console.error('Error in commandRun:', error);
            return interaction.followUp({
                content: 'An error occurred while processing the command. Please try again later.',
            });
        }
    },

    async messageRun(message) {
        try {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                return message.channel.send('You need to be in a voice channel to use this command.');
            }

            const poru = message.client.poru;
            const player = poru.players.get(message.guild!.id);

            if (!player) {
                return message.channel.send('There is no active player in this server.');
            }

            const currentTrack = player.currentTrack;
            const queueTracks = player.queue;

            if (!currentTrack && !queueTracks.length) {
                return message.channel.send('The queue is currently empty.');
            }

            const tracks = queueTracks.map(
                (track, index) =>
                    `\`${index + 1}\` <a:Animated_Arrow_White:1311721526739079280> **${track.info.title}** - \`${track.info.requester.displayName}\``
            );

            const chunkSize = 10;
            const pages = [];

            for (let i = 0; i < tracks.length; i += chunkSize) {
                const chunk = tracks.slice(i, i + chunkSize);
                pages.push(
                    new EmbedBuilder()
                        .setAuthor({
                            name: `${currentTrack?.info.title || 'Nothing'} - ${currentTrack?.info.author || 'Unknown'}`,
                            iconURL: 'https://cdn3.emoji.gg/emojis/71921-headphones.gif',
                        })
                        .setDescription(chunk.join('\n'))
                        .setFooter({ text: `Page ${Math.ceil((i + 1) / chunkSize)}/${Math.ceil(tracks.length / chunkSize)}` })
                        .setColor('Random')
                );
            }

            if (pages.length === 0) {
                return message.channel.send('There are no songs in the queue to display.');
            }

            const paginator = new Paginator({ embeds: pages });
            return paginator.run(message);
        } catch (error) {
            console.error('Error in messageRun:', error);
            return message.channel.send('An error occurred while processing the command. Please try again later.');
        }
    },
});
