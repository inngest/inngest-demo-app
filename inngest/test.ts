import { inngest } from './client';
import { send, createEvents } from '../lib/testEvents';

export const sendTestEvents = inngest.createFunction(
  { name: 'Send test events', id: 'send-test-events' },
  { cron: '*/10 * * * *' },
  async ({ step }) => {
    const n = 14;

    console.log('Send test events invoked');

    // Enable this to spread events out over 10 min
    // disable this to show events executing all at once
    const withDelay = false;

    const events = await step.run('generate-events', () => {
      const generatedEvents = createEvents(n);
      if (!withDelay) {
        return generatedEvents;
      }
      // Randomly schedule events across the next 10 minutes
      return generatedEvents.map((evt) => ({
        ...evt,
        ts: new Date().valueOf() + Math.floor(Math.random() * 10 * 60 * 1000),
      }));
    });

    await step.run('send-events', () => send(events));
    return {
      success: true,
      message: `sent ${n} events`,
    };
  }
);
