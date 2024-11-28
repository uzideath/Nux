import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
	type: CommandType.ChatInput,
	description: 'Stop the current queue from playing.',
	aliases: ['s'],
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

			const { client } = interaction;
			const poru = client.poru;

			const player = poru.players.get(interaction.guild!.id);

			if (!player) {
				return interaction.reply({
					content: 'There is no active player for this server.',
					ephemeral: true,
				});
			}

			player.destroy();

			return interaction.reply({
				content: '<a:pepehi:1311716419620044930>',
			});
		} catch (error) {
			console.error('Error in commandRun:', error);
			return interaction.reply({
				content: 'An error occurred while processing the command. Please try again later.',
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

			const poru = message.client.poru;
			const player = poru.players.get(message.guild!.id);

			if (!player) {
				return message.channel.send('There is no active player for this server.');
			}

			player.destroy();

			return message.reply('<a:pepehi:1311716419620044930>');
		} catch (error) {
			console.error('Error in messageRun:', error);
			return message.channel.send('An error occurred while processing the command. Please try again later.');
		}
	},
});
