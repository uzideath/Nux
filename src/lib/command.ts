import { Command } from '@sapphire/framework';
import { EmbedBuilder, Colors, GuildMember } from 'discord.js';
import { AlyaPlayerType } from '../types';
import config from '../config';
import { CustomEmbed } from '../utils/embed';

export abstract class AlyaCommand extends Command {
    protected async MemberInVoiceChannel(interaction: Command.ChatInputCommandInteraction): Promise<boolean> {
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        if (!member?.voice.channel) {
            await interaction.editReply(`You must be in a voice channel to use this command. ${config.emojis.error}`);
            return false;
        }

        return true;
    }

    protected async MemberInBotVoiceChannel(interaction: Command.ChatInputCommandInteraction): Promise<boolean> {
        const member = interaction.member as GuildMember;
        const botVoiceChannel = interaction.guild?.members.me?.voice.channel;
        const memberVoiceChannel = member.voice.channel;

        if (botVoiceChannel!.id !== memberVoiceChannel!.id) {
            await this.Reply(interaction, 'You need to be in the same voice channel as me to use this command.', Colors.Red);
            return false;
        }

        return true;
    }

    protected async PlayerExists(interaction: Command.ChatInputCommandInteraction): Promise<AlyaPlayerType | undefined> {
        const player = this.container.kazagumo.players.get(interaction.guildId!) as AlyaPlayerType;

        if (player) {
            await this.Reply(interaction, "I am already playing music on another channel");
            return undefined;
        }

        return player;
    }


    protected async QueueNotEmpty(interaction: Command.ChatInputCommandInteraction, player: AlyaPlayerType): Promise<boolean> {
        if (player.queue.length === 0) {
            await interaction.editReply(`The queue is currently empty. ${config.emojis.error}`);
            return false;
        }

        return true;
    }

    protected async Reply(interaction: Command.ChatInputCommandInteraction, content: string, color: typeof Colors[keyof typeof Colors] = Colors.White) {
        const embed = new EmbedBuilder()
            .setDescription(content)
            .setColor(color);

        await interaction.editReply({ embeds: [embed] });
    }

    protected Error(interaction: Command.ChatInputCommandInteraction, errorMessage: string) {
        const errorEmbed = new CustomEmbed(errorMessage)
            .setColor(Colors.Red)
            .setAuthor({ name: 'Error', iconURL: config.icons.error });

        interaction.editReply({ content: '', embeds: [errorEmbed] });
    }
}
