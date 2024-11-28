import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Stop the current queue from playing.',

    async commandRun(interaction) {
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

        let player = poru.players.get(interaction.guild!.id);
        if (player) {
            player.destroy();
        }

        return await interaction.reply(`<a:pepehi:1311716419620044930>`);
    },

    async messageRun(message) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to use this command.');
        }

        const poru = message.client.poru;
        const player = poru.players.get(message.guild!.id);

        if (player) {
            player.destroy();
            return message.reply(`<a:pepehi:1311716419620044930>`);
        } else {
            return message.channel.send('There is no active player for this server.');
        }
    },
});
