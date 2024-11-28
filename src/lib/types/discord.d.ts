import 'discord.js';
import { Poru } from 'poru';

declare module 'discord.js' {
    interface Client {
        poru: Poru;
    }
}
