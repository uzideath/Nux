import { CommandType } from '#lib/enums';
import { Command } from '#lib/structures';

export default new Command({
    type: CommandType.ChatInput,
    description: 'Skip to the next song in the queue!',

    async commandRun(interaction) {
        const member = await interaction.guild?.members.fetch(interaction.user.id);
        const voiceChannel = member?.voice.channel?.id;
        if (!voiceChannel) {
            return interaction.reply({
                content: 'You need to be in a voice channel to use this command.',
                ephemeral: true,
            });
        }

        let player = interaction.client.poru.players.get(interaction.guild!.id);
        if (player) {
            player.skip();
        }

        return await interaction.reply(`👍`);
    },

    async messageRun(message) {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to use this command.');
        }

        const player = message.client.poru.players.get(message.guild!.id);
        if (!player) {
            return message.channel.send('There is no active player for this server.');
        }

        player.skip();
        return message.reply('👍');
    },
});
