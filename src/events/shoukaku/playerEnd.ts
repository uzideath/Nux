import { TextChannel, EmbedBuilder, Colors } from 'discord.js';
import { Listener as Event } from '@sapphire/framework';
import config from '../../config';

export class PlayerEndEventListener extends Event {
    public override async run() {
        this.container.kazagumo.on('playerEnd', async (player) => {
            if (player.queue.size === 0) {
                const channel = this.container.client.channels.cache.get(player.textId!) as TextChannel;
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setDescription(`Finished playing ${config.emojis.check}`)
                        .setColor(Colors.White);
                    await channel.send({ embeds: [embed] });
                }
            }
        });
    }
}
