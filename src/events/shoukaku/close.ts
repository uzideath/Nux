import { Listener as Event } from '@sapphire/framework';

export class CloseEventListener extends Event {
    public override async run() {
        this.container.kazagumo.shoukaku.on('close', (name, code, reason) =>
            this.container.logger.warn(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`)
        );
    }
}
