import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events } from 'kazagumo';

@ApplyOptions<Listener.Options>({ once: true, event: Events.PlayerClosed })
export class UserEvent extends Listener<typeof Events.PlayerClosed> {
    public override async run() {
        this.container.kazagumo.shoukaku.on('close', (name, code, reason) => 
            this.container.logger.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`)
        );
    }
}
