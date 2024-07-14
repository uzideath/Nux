import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: false })
export class ErrorEventListener extends Listener {
    public override async run() {
        this.container.kazagumo.shoukaku.on('error', (name, error) => {
            this.container.logger.error(`Lavalink ${name}: Error Caught,`, error);
        });
    }
}