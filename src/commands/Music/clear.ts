import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, Colors } from 'discord.js';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Clears the current queue'
})
export class ClearCommand extends Command {
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
            return interaction.editReply(`You must be in a voice channel to use this command. ${config.emojis.error}`);
        }

        const player = this.container.kazagumo.players.get(interaction.guildId!);

        if (!player) {
            return interaction.editReply(`There is no active player in this server. ${config.emojis.error}`);
        }

        if (player.queue.size === 0) {
            return interaction.editReply(`The queue is currently empty. ${config.emojis.error}`);
        }

        player.queue.clear();

        const embed = new EmbedBuilder()
            .setDescription(`The queue has been cleared. ${config.emojis.check}`)
            .setColor(Colors.White);

        return interaction.editReply({ embeds: [embed] });
    }
}
