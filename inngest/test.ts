import { inngest } from './client';
import { send, createEvents } from '../lib/testEvents';

export const sendTestEvents = inngest.createFunction(
  { name: 'Send test events' },
  { cron: '*/10 * * * *' },
  async ({ step }) => {
    const n = 14;

    console.log('Send test events invoked');

    const events = await step.run('Generate events', () => {
      const generatedEvents = createEvents(n);
      // Randomly schedule events across the next 10 minutes
      return generatedEvents.map((evt) => ({
        ...evt,
        ts: new Date().valueOf() + Math.floor(Math.random() * 10 * 60 * 1000),
      }));
    });

    await step.run('Send events', () => send(events));
    return {
      success: true,
      message: `sent ${n} events`,
    };
  }
);
