import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, Colors } from 'discord.js';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Removes a song from the playing queue.'
})
export class RemoveCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addNumberOption((option) =>
                    option
                        .setName('position')
                        .setDescription('The position of the song to remove from the queue')
                        .setRequired(true)
                )
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        const position = interaction.options.getNumber('position', true);

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

        if (position < 1 || position > player.queue.size) {
            return interaction.editReply(`Invalid position provided. The queue currently has ${player.queue.size} songs. ${config.emojis.error}`);
        }

        player.queue.remove(position - 1);

        const embed = new EmbedBuilder()
            .setDescription(`The song at position ${position} has been removed. ${config.emojis.check}`)
            .setColor(Colors.White);

        return interaction.editReply({ embeds: [embed] });
    }
}
