import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Shuffle shuffle shuffle!!',

    async commandRun(interaction) {
        try {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const voiceChannel = member?.voice.channel;

            if (!voiceChannel) {
                return interaction.reply({
                    content: 'You need to be in a voice channel to use this command.',
                    ephemeral: true,
                });
            }

            const player = interaction.client.poru.players.get(interaction.guild!.id);
            if (!player) {
                return interaction.reply({
                    content: 'There is no active player for this server.',
                    ephemeral: true,
                });
            }

            player.queue.shuffle();
            return await interaction.reply('🔀 The queue has been shuffled!');
        } catch (error) {
            console.error('Error in commandRun:', error);
            return interaction.reply({
                content: 'An error occurred while executing the command. Please try again later.',
                ephemeral: true,
            });
        }
    },

    async messageRun(message) {
        try {
            const voiceChannel = message.member?.voice.channel;

            if (!voiceChannel) {
                return message.channel.send('You need to be in a voice channel to use this command.');
            }

            const player = message.client.poru.players.get(message.guild!.id);
            if (!player) {
                return message.channel.send('There is no active player for this server.');
            }

            player.queue.shuffle();
            return message.channel.send('🔀 The queue has been shuffled!');
        } catch (error) {
            console.error('Error in messageRun:', error);
            return message.channel.send('An error occurred while executing the command. Please try again later.');
        }
    },
});
