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
        if (!voiceChannel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command.',
                ephemeral: true,
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
            return interaction.reply({
                content: 'There was an error loading the track.',
                ephemeral: true,
            });
        }

        if (res.loadType === 'empty') {
            return interaction.reply({
                content: 'No tracks found for your query.',
                ephemeral: true,
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

            interaction.reply({
                content: `Playlist \`${res.playlistInfo.name}\` loaded with ${res.tracks.length} tracks.`,
            });
        } else {
            const track = res.tracks[0];
            track.info.requester = interaction.user;
            player.queue.add(track);

            interaction.reply({
                content: `Queued: \`${track.info.title}\`.`,
            });
        }

        // Play if the player is not already playing
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
            source: 'ytsearch', // Change this source if needed
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

    async autoCompleteRun(interaction) {
        const focus = interaction.options.getFocused();
        // Example: Provide autocomplete suggestions based on some predefined tracks or queries
        const choices = ['Track 1', 'Track 2', 'Track 3'];
        const filtered = choices.filter((choice) =>
            choice.toLowerCase().startsWith(focus.toLowerCase())
        );
        return interaction.respond(
            filtered.map((choice) => ({
                name: choice,
                value: choice,
            }))
        );
    },
});
