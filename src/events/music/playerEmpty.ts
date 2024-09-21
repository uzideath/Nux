import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { TextChannel, EmbedBuilder, Colors } from 'discord.js';
import { Time } from '@sapphire/time-utilities'
import config from '../../config';

@ApplyOptions<Listener.Options>({ event: 'ready', once: false })
export class PlayerEmptyListener extends Listener {
    public override async run() {
        this.container.kazagumo.on('playerEmpty', (player) => {
            setTimeout(() => {
                if (!player.playing && player.queue.size === 0) {
                    const channel = this.container.client.channels.cache.get(player.textId!) as TextChannel;
                    if (channel) {
                        const embed = new EmbedBuilder()
                            .setDescription(`Left due to inactivity ${config.emojis.warn}`)
                            .setColor(Colors.White);

                        channel.send({ embeds: [embed] }).then((message) => {
                            player.data.set('message', message);
                        });
                    }
                    player.destroy();
                }
            }, Time.Minute * config.bot.inactivity);
        });
    }
}