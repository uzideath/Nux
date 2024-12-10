import type { Awaitable, ClientEvents } from 'discord.js';
import type { PoruEvents } from 'poru';
import { Client } from './Client';

export class Listener<E extends keyof ClientEvents | keyof PoruEvents = keyof ClientEvents | keyof PoruEvents> {
	private data: ListenerOptions<E>;
	public event: keyof ClientEvents | keyof PoruEvents;
	public once: boolean;
	public run: (...args: EventArgs<E>) => Awaitable<void>;

	public constructor(data: ListenerOptions<E>) {
		this.data = data;
		this.event = data.event;
		this.once = data.once ?? false;
		this.run = data.run;
	}
	public set name(name: string) {
		this.data.name = this.data.name ?? name;
	}
	public get name(): string {
		if (!this.data.name) throw new Error('Listener name is not set');
		return this.data.name;
	}
}

interface ListenerOptions<T> {
	name?: string;
	event: T extends keyof ClientEvents | keyof PoruEvents ? T : never;
	once?: boolean;
	run(...args: EventArgs<T>): Awaitable<void>;
}

type EventArgs<T> = T extends keyof ClientEvents
	? [...args: ClientEvents[T], client: Client<true>]
	: T extends keyof PoruEvents
		? [...args: Parameters<PoruEvents[T]>, client: Client<true>]
		: unknown[];
