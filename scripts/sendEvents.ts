import { createEvents, send } from '../lib/testEvents';

// yarn send <n> <event name>
const n: number = parseInt(process.argv[2] || '100', 10);
const eventName: string | undefined = process.argv[3];

const shouldDelay = false;

const events = createEvents(n, eventName, shouldDelay);

console.log(`Sending ${events.length} events`);

send(events);
