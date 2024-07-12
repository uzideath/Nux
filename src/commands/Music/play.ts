import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { KazagumoPlayer, KazagumoSearchResult } from 'kazagumo';
import { AlyaEmbed } from '../../utils/embed';
import { Colors } from 'discord.js';

@ApplyOptions<Command.Options>({
    description: 'Play a song or playlist from search'
})
export class UserCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName('query')
                        .setDescription('The song to search and play')
                        .setRequired(true)
                )
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const query = interaction.options.getString('query', true);
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        await interaction.deferReply();

        if (!member?.voice.channel) {
            return interaction.editReply('You must be in a voice channel to use this command.');
        }

        let author = '';
        let image = '';

        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            author = 'YouTube';
            image = 'https://cdn3.emoji.gg/emojis/17807-youtube.png'; // Reemplaza esto con la URL de la imagen de YouTube
        } else if (query.includes('spotify.com')) {
   
            author = 'Spotify';
            image = 'https://cdn3.emoji.gg/emojis/2320-spotify.png'; // Reemplaza esto con la URL de la imagen de Spotify
        }

        let player: KazagumoPlayer;
        try {
            player = await this.container.kazagumo.createPlayer({
                guildId: interaction.guildId!,
                textId: interaction.channel?.id!,
                voiceId: member.voice.channelId!,
                volume: 100
            });
        } catch (error) {
            console.error('Error creating the player:', error);
            return interaction.editReply('There was an error creating the player.');
        }

        let result: KazagumoSearchResult;
        try {
            result = await this.container.kazagumo.search(query, { requester: interaction.user });
        } catch (error) {
            console.error('Error searching for the song:', error);
            return interaction.editReply('There was an error searching for the song.');
        }

        if (!result.tracks.length) {
            return interaction.editReply('No results were found.');
        }

        if (result.type === 'PLAYLIST') {
            for (let track of result.tracks) {
                player.queue.add(track);
            }
            const embed = new AlyaEmbed(`Added playlist **${result.playlistName}** to the queue.`)
                .setColor(Colors.White)
                .setAuthor({ name: author, iconURL: image })
            await interaction.editReply({ content: '', embeds: [embed] });
        } else {
            const track = result.tracks[0];
            player.queue.add(track);
            const trackUrl = track.uri;
            const embed = new AlyaEmbed(`Added [**${track.title}** by **${track.author}**](${trackUrl}) to the queue.`)
                .setAuthor({ name: author, iconURL: image });
            
            return await interaction.editReply({ content: '', embeds: [embed] });
        }

        if (!player.playing && !player.paused) {
            player.play().catch(error => {
                console.error('Error playing the track:', error);
                return interaction.editReply('There was an error playing the track.');
            });
        }
        return;
    }
}
