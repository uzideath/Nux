import { Listener as Event } from '@sapphire/framework';

export class DebugEventListener extends Event {
    public override async run() {
        this.container.kazagumo.shoukaku.on('debug', (name, info) => this.container.logger.debug(`Lavalink ${name}: Debug,`, info));
    }
}