import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Skip to the next song in the queue!',
	aliases: ['sk'],
	cooldown: 5,
	async commandRun(interaction) {
		try {
			await interaction.deferReply();

			const member = await interaction.guild?.members.fetch(interaction.user.id);
			const voiceChannel = member?.voice.channel?.id;

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

			if (player.queue.length > 0) {
				player.skip();
				return interaction.editReply({ content: '👍' });
			} else if (player.isAutoPlay) {
				try {
					await player.autoplay();
					return interaction.editReply({ content: 'Autoplay started!' });
				} catch (error) {
					console.error('Error during autoplay in skip command:', error);
					return interaction.editReply({
						content: 'No more tracks available for autoplay.',
					});
				}
			} else {
				player.skip();
				return interaction.editReply({ content: 'No more tracks in the queue.' });
			}
		} catch (error) {
			console.error('Error in commandRun:', error);
			return interaction.editReply({
				content: 'An error occurred while processing your request. Please try again later.',
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

			if (player.queue.length > 0) {
				player.skip();
				return message.channel.send('👍');
			} else if (player.isAutoPlay) {
				try {
					await player.autoplay();
				} catch (error) {
					console.error('Error during autoplay in skip command:', error);
					return message.channel.send('No more tracks available for autoplay.');
				}
			} else {
				player.skip();
				return message.channel.send('No more tracks in the queue.');
			}
		} catch (error) {
			console.error('Error in messageRun:', error);
			return message.channel.send('An error occurred while processing your request. Please try again later.');
		}
	},
});
