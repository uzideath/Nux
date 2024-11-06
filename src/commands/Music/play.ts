import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { KazagumoPlayer, KazagumoSearchResult } from 'kazagumo';
import { CustomEmbed } from '../../utils/embed';
import { Colors } from 'discord.js';
import config from '../../config';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Play a song or playlist from search'
})
export class UserCommand extends AlyaCommand {
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
            return this.Error(interaction, 'You must be in a voice channel to use this command.');
        }

        const { author, image, engine } = this.getSourceInfo(query);

        let player: KazagumoPlayer;
        try {
            player = await this.createPlayer(interaction.guildId!, interaction.channel?.id!, member.voice.channelId!);
        } catch (error) {
            console.error('Error creating the player:', error);
            return this.Error(interaction, 'There was an error creating the player.');
        }

        let result: KazagumoSearchResult;
        try {
            result = await this.searchTrack(query, interaction.user.displayName, engine);
        } catch (error) {
            console.error('Error searching for the song:', error);
            return this.Error(interaction, 'There was an error searching for the song.');
        }

        if (!result.tracks.length) {
            return this.Error(interaction, 'No results were found.');
        }

        return await this.handleSearchResult(result, player, author, image, interaction);
    }

    private getSourceInfo(query: string) {
        if (query.includes('youtube.com') || query.includes('youtu.be')) {
            return { author: 'YouTube', image: config.icons.youtube, engine: 'youtube' };
        } else if (query.includes('spotify.com')) {
            return { author: 'Spotify', image: config.icons.spotify, engine: 'spotify' };
        }
        return { author: 'Youtube', image: config.icons.youtube, engine: 'youtube' };
    }

    private async createPlayer(guildId: string, textId: string | undefined, voiceId: string) {
        return await this.container.kazagumo.createPlayer({
            guildId,
            textId: textId!,
            voiceId,
            volume: 100,
            deaf: true
        });
    }

    private async searchTrack(query: string, requester: string, engine: string) {
        return await this.container.kazagumo.search(query, { requester, engine });
    }

    private async handleSearchResult(result: KazagumoSearchResult, player: KazagumoPlayer, author: string, image: string, interaction: Command.ChatInputCommandInteraction) {
        try {
            if (result.type === 'PLAYLIST') {
                result.tracks.forEach(track => player.queue.add(track));
                const embed = this.createPlaylistEmbed(result.playlistName!, author, image);
                await interaction.editReply({ content: '', embeds: [embed] });
            } else {
                const track = result.tracks[0];
                player.queue.add(track);
                const embed = this.createTrackEmbed(track.title, track.author!, track.uri!, author, image);
                await interaction.editReply({ content: '', embeds: [embed] });
            }

            if (!player.playing && !player.paused) {
                player.play().catch(error => {
                    console.error('Error playing the track:', error);
                    this.Error(interaction, 'There was an error playing the track.');
                });
            }
        } catch (error) {
            console.error('Error handling search result:', error);
            this.Error(interaction, 'There was an error handling the search result.');
        }
    }

    private createPlaylistEmbed(playlistName: string, author: string, image: string) {
        return new CustomEmbed(`Added playlist **${playlistName}** to the queue.`)
            .setColor(Colors.White)
            .setAuthor({ name: author, iconURL: image });
    }

    private createTrackEmbed(title: string, trackAuthor: string, url: string, author: string, image: string) {
        return new CustomEmbed(`Added [**${title}** by **${trackAuthor}**](${url}) to the queue.`)
            .setAuthor({ name: author, iconURL: image });
    }
}
