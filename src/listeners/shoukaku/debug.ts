import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.kazagumo.shoukaku.on('debug', (name, info) => this.container.logger.debug(`Lavalink ${name}: Debug,`, info));
    }
}


