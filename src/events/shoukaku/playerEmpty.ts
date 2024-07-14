import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { TextChannel, EmbedBuilder, Colors } from 'discord.js';
import { Time } from '@sapphire/time-utilities'
import config from '../../config';
import { Events } from 'kazagumo';

@ApplyOptions<Listener.Options>({ event: Events.PlayerEmpty, once: true })
export class UserEvent extends Listener<typeof Events.PlayerEmpty> {
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
