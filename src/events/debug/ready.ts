import { ApplyOptions } from '@sapphire/decorators';
import { Listener as Event } from '@sapphire/framework';

@ApplyOptions<Event.Options>({ once: true })
export class PlayerReadyEventListener extends Event {
    public override async run() {
        this.container.kazagumo.shoukaku.on('ready', (name) => this.container.logger.info(`Lavalink ${name}: Ready!`));
    }
}