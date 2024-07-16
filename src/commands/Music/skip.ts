import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Colors } from 'discord.js';
import config from '../../config';
import { AlyaCommand } from '../../lib/command';

@ApplyOptions<Command.Options>({
    description: 'Skip the current song and play the next one in the queue'
})
export class SkipCommand extends AlyaCommand {
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
        if (!await this.MemberInBotVoiceChannel(interaction)) return;

        const player = await this.PlayerExists(interaction);
        if (!player) return;

        if (player.queue.length === 0) {
            player.shoukaku.stopTrack();
            await this.Reply(interaction, `There are no more songs in the queue. Stopping ${config.emojis.check}`, Colors.Red);
            return;
        }

        await this.Reply(interaction, `Skipped. ${config.emojis.check}`, Colors.Green);

        setTimeout(async () => {
            await interaction.deleteReply();
        }, 3000);

        return player.skip();
    }
}
