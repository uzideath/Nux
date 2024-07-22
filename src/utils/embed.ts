import { Colors, EmbedBuilder } from 'discord.js';
import config from '../config';

export class AlyaEmbed extends EmbedBuilder {
    constructor(description: string) {
        super();
        this.setColor(Colors.White)
            .setAuthor({ name: 'Now playing...', iconURL: config.icons.playing })
            .setDescription(description)
            .setTimestamp();
    }
}
