import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ event: 'ready', once: false })
export class CloseEventListener extends Listener {
    public override async run() {
        this.container.kazagumo.shoukaku.on('close', (name, code, reason) =>
            this.container.logger.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`)
        );
    }
}