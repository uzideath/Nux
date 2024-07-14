import { Listener as Event } from '@sapphire/framework';

export class ErrorEventListener extends Event {
    public override async run() {
        this.container.kazagumo.shoukaku.on('error', (name, error) => {
            this.container.logger.error(`Lavalink ${name}: Error Caught,`, error);
        });
    }
}