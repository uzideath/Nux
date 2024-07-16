import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Colors } from 'discord.js';
import { AlyaCommand } from '../../lib/command';
import config from '../../config';

@ApplyOptions<Command.Options>({
    description: 'Stop the music and leave the voice channel'
})
export class StopCommand extends AlyaCommand {
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
        if (!player) return this.Reply(interaction, `There's nothing playing right now. ${config.emojis.error}`);

        player.destroy();
        await this.Reply(interaction, `Music stopped and bot disconnected from the voice channel. ${config.emojis.check}`, Colors.Red);
    }
}
