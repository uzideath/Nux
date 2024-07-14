import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'kazagumo';

@ApplyOptions<Listener.Options>({ once: true, event: Events.PlayerError })
export class UserEvent extends Listener<typeof Events.PlayerError> {
    public override async run() {
        this.container.kazagumo.shoukaku.on('error', (name, error) => {
            this.container.logger.error(`Lavalink ${name}: Error Caught,`, error);
        });
    }
}