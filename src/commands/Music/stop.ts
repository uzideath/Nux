import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

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
        return this.reply(interaction, 'Music stopped and bot disconnected from the voice channel.');
    }

    private async reply(interaction: Command.ChatInputCommandInteraction, content: string) {
        await interaction.reply({ content: content, ephemeral: true });
    }
}
