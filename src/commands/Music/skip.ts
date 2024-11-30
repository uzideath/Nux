import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Skip to the next song in the queue!',
	aliases: ['sk'],
	async commandRun(interaction) {
		try {
			const member = await interaction.guild?.members.fetch(interaction.user.id);
			const voiceChannel = member?.voice.channel?.id;

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

			if (player.queue.length > 0) {
				player.skip();
			} else if (player.isAutoPlay) {
				try {
					await player.autoplay();
				} catch (error) {
					console.error('Error during autoplay in skip command:', error);
					return interaction.reply({
						content: 'No more tracks available for autoplay.',
						ephemeral: true,
					});
				}
			} else {
				player.skip();
				interaction.reply({
					content: 'No more tracks in the queue.',
					ephemeral: true,
				});
			}

			await interaction.reply('👍')
			
		} catch (error) {
			console.error('Error in commandRun:', error);
			return interaction.reply({
				content: 'An error occurred while processing your request. Please try again later.',
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

			if (player.queue.length > 0) {
				player.skip();
			} else if (player.isAutoPlay) {
				try {
					await player.autoplay();
				} catch (error) {
					console.error('Error during autoplay in skip command:', error);
					return message.reply({
						content: 'No more tracks available for autoplay.',
		
					});
				}
			} else {
				player.skip();
				message.reply({
					content: 'No more tracks in the queue.',
				});
			}
		} catch (error) {
			console.error('Error in messageRun:', error);
			return message.channel.send('An error occurred while processing your request. Please try again later.');
		}
	},
});
