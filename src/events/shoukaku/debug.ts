import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'kazagumo';

@ApplyOptions<Listener.Options>({ once: true, event: Events.Debug })
export class UserEvent extends Listener<typeof Events.Debug> {
    public override async run() {
        this.container.kazagumo.shoukaku.on('debug', (name, info) => this.container.logger.debug(`Lavalink ${name}: Debug,`, info));
    }
}