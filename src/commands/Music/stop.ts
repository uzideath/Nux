import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    description: 'Stop the music and leave the voice channel'
})
export class StopCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const player = this.container.kazagumo.players.get(interaction.guildId!);

        if (!player) {
            return this.reply(interaction, 'There is no active player in this server.');
        }

        player.destroy();

        const embed = new EmbedBuilder()
            .setDescription('Music stopped and bot disconnected from the voice channel.')
            .setColor('#FF0000');

        return interaction.reply({ embeds: [embed], ephemeral: false });
    }

    private async reply(interaction: Command.ChatInputCommandInteraction, content: string) {
        const embed = new EmbedBuilder()
            .setDescription(content)
            .setColor('#FF0000');

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
}
