import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { KazagumoPlayer } from 'kazagumo';
import { AlyaEmbed } from '../../utils/embed';
import { Colors } from 'discord.js';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Toggle loop mode for the current queue'
})
export class LoopCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        await interaction.deferReply();

        if (!member?.voice.channel) {
            return interaction.editReply('You must be in a voice channel to use this command.');
        }

        const player: KazagumoPlayer | undefined = this.container.kazagumo.getPlayer(interaction.guildId!);

        if (!player) {
            return interaction.editReply('No active player found.');
        }

        if (player.loop === 'queue') {
            player.setLoop('none');
            const embed = new AlyaEmbed(`Loop mode has been disabled ${config.emojis.check}`)
                .setColor(Colors.White);
            return interaction.editReply({ embeds: [embed] });
        } else {
            player.setLoop('queue');
            const embed = new AlyaEmbed(`Loop mode has been enabled ${config.emojis.check}`)
                .setColor(Colors.White);
            return interaction.editReply({ embeds: [embed] });
        }
    }
}
