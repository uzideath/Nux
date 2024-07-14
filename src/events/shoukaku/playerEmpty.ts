import { Listener as Event } from '@sapphire/framework';
import { TextChannel, EmbedBuilder, Colors } from 'discord.js';
import { Time } from '@sapphire/time-utilities'
import config from '../../config';

export class PlayerEmptyEventListener extends Event {
    public override async run() {
        this.container.kazagumo.on('playerEmpty', (player) => {
            setTimeout(() => {
                if (player.queue.size === 0) {
                    player.destroy();

                    const channel = this.container.client.channels.cache.get(player.textId!) as TextChannel;
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setDescription(`Left due to inactivity ${config.emojis.warn}`)
                            .setColor(Colors.White);

                        channel.send({ embeds: [embed] }).then((message) => {
                            player.data.set('message', message);
                        });
                    }
                }
            }, Time.Minute * config.Bot.inactivity);
        });
    }
}
