import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Shuffle shuffle shuffle!!',
	aliases: ['sh'],
	async commandRun(interaction) {
		try {
			await interaction.deferReply();

			const member = await interaction.guild?.members.fetch(interaction.user.id);
			const voiceChannel = member?.voice.channel;

			if (!voiceChannel) {
				return interaction.editReply({
					content: 'You need to be in a voice channel to use this command.',
				});
			}

			const player = interaction.client.poru.players.get(interaction.guild!.id);
			if (!player) {
				return interaction.editReply({
					content: 'There is no active player for this server.',
				});
			}

			player.queue.shuffle();
			return interaction.editReply('<a:spin:1311752742686953534>');
		} catch (error) {
			console.error('Error in commandRun:', error);
			return interaction.editReply({
				content: 'An error occurred while executing the command. Please try again later.',
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
			return message.reply('<a:spin:1311752742686953534>');
		} catch (error) {
			console.error('Error in messageRun:', error);
			return message.channel.send('An error occurred while executing the command. Please try again later.');
		}
	},
});
