import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { AlyaEmbed } from '../../utils/embed';
import { Colors } from 'discord.js';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Show the currently playing song'
})
export class NowPlayingCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        if (!member?.voice.channel) {
            return interaction.reply('You must be in a voice channel to use this command.');
        }

        let player = this.container.kazagumo.players.get(interaction.guildId!);

        if (!player || !player.playing) {
            return interaction.reply('There is no song currently playing.');
        }

        const currentTrack = player.queue.current;
        const trackUrl = currentTrack?.uri;
        const embed = new AlyaEmbed(`[**${currentTrack?.title}** by **${currentTrack?.author}**](${trackUrl})`)
            .setColor(Colors.White)
            .setAuthor({ name: 'Now Playing', iconURL: config.Icons.Playing }) 

        return await interaction.reply({ content: '', embeds: [embed] });
    }
}
