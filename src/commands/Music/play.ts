import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { KazagumoPlayer, KazagumoSearchResult } from 'kazagumo';
import { AlyaEmbed } from '../../utils/embed';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Play a song from search'
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

        if (!member?.voice.channel) {
            return this.reply(interaction, 'You must be in a voice channel to use this command.');
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
            return this.reply(interaction, 'There was an error creating the player.');
        }

        let result: KazagumoSearchResult;
        try {
            result = await this.container.kazagumo.search(query, { requester: interaction.user });
        } catch (error) {
            console.error('Error searching for the song:', error);
            return this.reply(interaction, 'There was an error searching for the song.');
        }

        if (!result.tracks.length) {
            return this.reply(interaction, 'No results were found.');
        }

        if (result.type === 'PLAYLIST') {
            for (let track of result.tracks) {
                player.queue.add(track);
            }
            await this.reply(interaction, `Added playlist **${result.playlistName}** to the queue.`);
        } else {
            const track = result.tracks[0];
            player.queue.add(track);
            const trackUrl = track.uri;
            const embed = new AlyaEmbed(`Added [**${track.title}** by **${track.author}**](${trackUrl}) to the queue.`)
                .setAuthor({ name: interaction.user.displayName, iconURL: config.Icons.Check })
                
            await interaction.reply({ embeds: [embed] });
        }

        if (!player.playing && !player.paused) {
            player.play().catch(error => {
                console.error('Error playing the track:', error);
                this.reply(interaction, 'There was an error playing the track.');
            });
        }
    }

    private async reply(interaction: Command.ChatInputCommandInteraction, content: string) {
        await interaction.reply({ content: content });
    }
}