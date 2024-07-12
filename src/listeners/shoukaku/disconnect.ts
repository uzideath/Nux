import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.Kazagumo.shoukaku.on('disconnect', (name) => {
            const players = [...this.container.Kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
            players.map(player => {
                this.container.Kazagumo.destroyPlayer(player.guildId);
                player.destroy();
            });
            this.container.logger.warn(`Lavalink ${name}: Disconnected`);
        });
    }
}
