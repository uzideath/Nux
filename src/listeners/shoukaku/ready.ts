import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.Kazagumo.shoukaku.on('ready', (name) => this.container.logger.info(`Lavalink ${name}: Ready!`));
    }
}
