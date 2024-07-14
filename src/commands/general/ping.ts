import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
    description: 'Check the app latency.',
})
export class PingCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }

    public override async messageRun(message: Message) {
        const msg = await send(message, 'Ping?');

        const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
            }ms.`;

        return send(message, content);
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return interaction.reply({ content: `Pong! bot latency is \`${Math.round(this.container.client.ws.ping)}\` ms` });
    }
}