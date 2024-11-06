import type { Events } from '@sapphire/framework';
import { Listener as Event } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class MentionEvent extends Event<typeof Events.MentionPrefixOnly> {
	public override async run(message: Message) {
		const prefix = this.container.client.options.defaultPrefix;
		if (message.channel.isSendable()) message.reply(prefix ? `My prefix in this guild is: \`${prefix}\`` : 'Cannot find any Prefix for Message Commands.');
		return;
	}
}
