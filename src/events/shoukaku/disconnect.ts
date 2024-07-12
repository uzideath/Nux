import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.kazagumo.shoukaku.on('disconnect', (name) => {
            const players = [...this.container.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
            players.map(player => {
                this.container.kazagumo.destroyPlayer(player.guildId);
                player.destroy();
            });
            this.container.logger.warn(`Lavalink ${name}: Disconnected`);
        });
    }
}