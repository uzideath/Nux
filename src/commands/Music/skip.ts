import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import config from '../../config';
import { EmbedBuilder } from '@discordjs/builders';

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
            return interaction.reply({
                content: 'There is no active player in this server.',
                ephemeral: true
            });
        }

        if (player.queue.length === 0) {
            player.shoukaku.stopTrack();
            return interaction.reply({
                content: `There are no more songs in the queue. Stopping ${config.emojis.check}`,
                ephemeral: false
            });
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription(`Skipped. ${config.emojis.check}`)
            ],
            ephemeral: true
        });

        setTimeout(async () => {
            await interaction.deleteReply();
        }, 3000);

        return player.skip();
    }
}
