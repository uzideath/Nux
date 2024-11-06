import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { CustomEmbed } from '../../utils/embed';
import { Colors } from 'discord.js';
import config from '../../config';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Show the currently playing song'
})
export class NowPlayingCommand extends AlyaCommand {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (!await this.MemberInVoiceChannel(interaction)) return;

        let player = this.container.kazagumo.players.get(interaction.guildId!);

        if (!player || !player.playing) {
            return interaction.reply('There is no song currently playing.');
        }

        const currentTrack = player.queue.current;
        const trackUrl = currentTrack?.uri;
        const embed = new CustomEmbed(`[**${currentTrack?.title}** by **${currentTrack?.author}**](${trackUrl})`)
            .setColor(Colors.White)
            .setAuthor({ name: 'Now Playing', iconURL: config.icons.playing })

        return await interaction.reply({ content: '', embeds: [embed] });
    }
}
