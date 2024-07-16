import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { TextChannel } from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';
import { AlyaEmbed } from '../../utils/embed';

@ApplyOptions<Listener.Options>({ event: 'ready', once: false })
export class PlayerStartListener extends Listener {
    public override async run() {
        this.container.kazagumo.on('playerStart', (player: KazagumoPlayer, track) => {
            const channel = this.container.client.channels.cache.get(player.textId!) as TextChannel;
            if (channel) {
                const embed = new AlyaEmbed(`[**${track.title}**](${track.uri})`)
                channel.send({ embeds: [embed] });
            }
        });
    }
}