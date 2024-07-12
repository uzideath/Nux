import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Skip the current song and play the next one in the queue'
})
export class SkipCommand extends Command {
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

        if (player.queue.length === 0) {
            return this.reply(interaction, 'There are no more songs in the queue.');
        }

        await this.reply(interaction, config.emojis.check);
        player.skip();
    }

    private async reply(interaction: Command.ChatInputCommandInteraction, content: string) {
        await interaction.reply({ content: content, ephemeral: false });
    }
}
