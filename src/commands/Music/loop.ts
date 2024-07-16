import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import config from '../../config';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Toggle loop mode for the current queue'
})
export class LoopCommand extends AlyaCommand {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply();

        if (!await this.MemberInVoiceChannel(interaction)) return;

        const player = await this.PlayerExists(interaction);
        if (!player) return;

        if (player.loop === 'queue') {
            player.setLoop('none');
            await this.Reply(interaction, `Loop mode has been disabled ${config.emojis.check}`);
        } else {
            player.setLoop('queue');
            await this.Reply(interaction, `Loop mode has been enabled ${config.emojis.check}`);
        }
    }
}
