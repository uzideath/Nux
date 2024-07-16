import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Colors, GuildMember } from 'discord.js';
import { AlyaCommand } from '../../lib/command';

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

        const member = interaction.member as GuildMember;
        const botVoiceChannel = interaction.guild?.members.me?.voice.channel;
        const memberVoiceChannel = member.voice.channel;

        if (!await this.MemberInVoiceChannel(interaction)) return;

        if (botVoiceChannel && botVoiceChannel.id !== memberVoiceChannel!.id) {
            await this.Reply(interaction, 'You need to be in the same voice channel as me to use this command.', Colors.Red);
            return;
        }

        const player = await this.PlayerExists(interaction);
        if (!player) {
            await this.Reply(interaction, 'No music is currently playing.', Colors.Red);
            return;
        }

        player.destroy();
        await this.Reply(interaction, 'Music stopped and bot disconnected from the voice channel.', Colors.Red);
    }
}
