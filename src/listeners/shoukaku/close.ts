import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
    public override async run() {
        this.container.Kazagumo.shoukaku.on('close', (name, code, reason) => this.container.logger.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`));
    }
}
