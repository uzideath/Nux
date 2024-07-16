import { Command } from '@sapphire/framework';
import { EmbedBuilder, Colors } from 'discord.js';
import { AlyaPlayerType } from '../types';
import config from '../config';

export abstract class AlyaCommand extends Command {
    protected async MemberInVoiceChannel(interaction: Command.ChatInputCommandInteraction): Promise<boolean> {
        const member = await interaction.guild?.members.fetch(interaction.user.id);

        if (!member?.voice.channel) {
            await interaction.editReply(`You must be in a voice channel to use this command. ${config.emojis.error}`);
            return false;
        }

        return true;
    }

    protected async PlayerExists(interaction: Command.ChatInputCommandInteraction): Promise<AlyaPlayerType | null> {
        const player = this.container.kazagumo.players.get(interaction.guildId!) as AlyaPlayerType;

        if (!player) {
            await interaction.editReply(`There is no active player in this server. ${config.emojis.error}`);
            return null;
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
}
