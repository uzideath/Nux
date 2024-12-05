import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Loop the queue!',
    cooldown: 10,
    async commandRun(interaction) {
        try {
            await interaction.deferReply();

            const member = await interaction.guild?.members.fetch(interaction.user.id);
            const voiceChannel = member?.voice.channel?.id;

            if (!voiceChannel) {
                return interaction.followUp({
                    content: 'You need to be in a voice channel to use this command.',
                });
            }

            const player = interaction.client.poru.players.get(interaction.guild!.id);

            if (!player) {
                return interaction.followUp({
                    content: 'No active player found for this server.',
                });
            }

            player.setLoop('QUEUE');
            return interaction.followUp('👍');
        } catch (error) {
            console.error('Error executing commandRun:', error);
            return interaction.followUp({
                content: 'An error occurred while processing the command. Please try again later.',
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

            player.setLoop('QUEUE');
            return message.reply('👍');
        } catch (error) {
            console.error('Error executing messageRun:', error);
            return message.channel.send('An error occurred while processing the command. Please try again later.');
        }
    },
});
