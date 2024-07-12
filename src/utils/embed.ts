import { container } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

export class AlyaEmbed extends EmbedBuilder {
    constructor(description: string) {
        super();
        const botName = container.client.application?.name || 'AlyaBot';
        this.setColor('#FF0000')
            .setAuthor({ name: 'AlyaBot', iconURL: 'https://cdn.darrennathanael.com/icons/spinning_disk.gif' })
            .setDescription(description)
            .setFooter({ text: botName, iconURL: 'https://i.pinimg.com/736x/e2/48/cf/e248cffd8b8c0fc9542d9ac71179b9fe.jpg' })
            .setTimestamp();
    }
}
