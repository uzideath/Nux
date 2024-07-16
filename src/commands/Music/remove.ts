import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import config from '../../config';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Removes a song from the playing queue.'
})
export class RemoveCommand extends AlyaCommand {
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
        await interaction.deferReply();

        const position = interaction.options.getNumber('position', true);

        if (!await this.MemberInVoiceChannel(interaction)) return;
        if (!await this.MemberInBotVoiceChannel(interaction)) return;
        
        const player = await this.PlayerExists(interaction);
        if (!player) return;
        if (!await this.QueueNotEmpty(interaction, player)) return;

        if (position < 1 || position > player.queue.size) {
            await this.Reply(interaction, `Invalid position provided. The queue currently has ${player.queue.size} songs. ${config.emojis.error}`);
            return;
        }

        player.queue.remove(position - 1);
        await this.Reply(interaction, `The song at position ${position} has been removed. ${config.emojis.check}`);
    }
}
