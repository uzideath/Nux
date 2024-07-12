import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.Kazagumo.shoukaku.on('error', (name, error) => {
            this.container.logger.error(`Lavalink ${name}: Error Caught,`, error);
        });
    }
}