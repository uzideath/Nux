import { TextChannel, EmbedBuilder, Colors } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'kazagumo';
import config from '../../config';

@ApplyOptions<Listener.Options>({ event: Events.PlayerEnd, once: true })
export class UserEvent extends Listener<typeof Events.PlayerEnd> {
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
