import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import config from '../../config';
import { KazagumoTrack } from 'kazagumo';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Toggle shuffle mode for the current queue'
})
export class ShuffleCommand extends AlyaCommand {
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
        if (!await this.QueueNotEmpty(interaction, player)) return;

        if (player.shuffleMode) {
            player.shuffleMode = false;
            await this.Reply(interaction, `Shuffle mode OFF. ${config.emojis.check}`);
        } else {
            player.shuffleMode = true;
            this.shuffle(player.queue);
            await this.Reply(interaction, `Shuffle mode ON. ${config.emojis.check}`);
        }
    }

    private shuffle(queue: KazagumoTrack[]) {
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
    }
}