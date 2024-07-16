import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Colors, EmbedBuilder, TextChannel, VoiceState } from 'discord.js';
import config from '../../config';
import { KazagumoPlayer } from 'kazagumo';

@ApplyOptions<Listener.Options>({ event: Events.VoiceStateUpdate })
export class VoiceStateUpdateListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options
        });
    }

    public async run(oldState: VoiceState, newState: VoiceState) {
        if (this.isBotDisconnected(oldState, newState)) {
            const player = this.container.kazagumo.players.get(oldState.guild.id);

            if (player) {
                this.cleanupPlayer(player);
                await this.notifyDisconnection(player);
            }
        }
    }

    private isBotDisconnected(oldState: VoiceState, newState: VoiceState): boolean {
        return oldState.guild.members.me?.id === oldState.id && oldState.channelId !== null && newState.channelId === null;
    }

    private cleanupPlayer(player: KazagumoPlayer): void {
        player.queue.clear();
        player.destroy();
        this.container.kazagumo.players.delete(player.guildId);
    }

    private async notifyDisconnection(player: KazagumoPlayer): Promise<void> {
        try {
            const channelId = player.textId;
            if (channelId) {
                const channel = await this.container.client.channels.fetch(channelId);
                if (channel && channel instanceof TextChannel) {
                    await channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.White)
                                .setDescription(`I've been disconnected, the queue has been cleared. ${config.emojis.check}`)
                        ]
                    });
                }
            }
        } catch (error) {
            console.error('Failed to notify disconnection:', error);
        }
    }
}
