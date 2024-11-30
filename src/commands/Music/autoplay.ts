import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Toggle autoplay mode for the music player.',
    aliases: ['ap'],

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

            if(!player.isPlaying){
                return interaction.reply(`Please play a song before using autoplay.`)
            }

            player.isAutoPlay = !player.isAutoPlay;
            const state = player.isAutoPlay ? 'Enabled' : 'Disabled';

            return interaction.reply(`<a:DancingChristmasPepe:1311733132285837373> **${state}**.`);
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

            if(!player.isPlaying){
                return message.channel.send(`Please play a song before using autoplay.`)
            }

            player.isAutoPlay = !player.isAutoPlay;
            const state = player.isAutoPlay ? 'Enabled' : 'Disabled';

            return message.channel.send(`<a:DancingChristmasPepe:1311733132285837373> **${state}**.`);
        } catch (error) {
            console.error('Error in messageRun:', error);
            return message.channel.send('An error occurred while executing the command. Please try again later.');
        }
    },
});
