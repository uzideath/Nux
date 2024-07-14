import { Listener as Event } from '@sapphire/framework';
import { TextChannel } from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';
import { AlyaEmbed } from '../../utils/embed';

export class PlayerStartEventListener extends Event {
    public override async run() {
        this.container.kazagumo.on('playerStart', (player: KazagumoPlayer, track) => {
            const channel = this.container.client.channels.cache.get(player.textId!) as TextChannel;
            if (channel) {
                const embed = new AlyaEmbed(`[**${track.title}** by **${track.author}**](${track.uri})`)
                channel.send({ embeds: [embed] });
            }
        });
    }
}
