import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Play a track in your voice channel!',
    options: [
        {
            name: 'track',
            description: 'The name or URL of the track to play.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async commandRun(interaction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id)
        const voiceChannel = member?.voice.channel?.id

        await interaction.deferReply();

        if (!voiceChannel) {
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
                content: 'There was an error loading the track.',
            });
        }

        if (res.loadType === 'empty') {
            return interaction.editReply({
                content: 'No tracks found for your query.',
            });
        }

        let player = poru.players.get(interaction.guild!.id);
        if (!player) {
            player = poru.createConnection({
                guildId: interaction.guild!.id,
                voiceChannel: voiceChannel,
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
    },

    async messageRun(message) {
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
            source: 'ytmsearch',
            requester: message.author,
        });

        if (res.loadType === 'error') {
            return message.channel.send('There was an error loading the track.');
        }

        if (res.loadType === 'empty') {
            return message.channel.send('No tracks found for your query.');
        }

        let player = poru.players.get(message.guild!.id);
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
    },
});
