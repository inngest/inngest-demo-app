import { inngest } from "./client";
import { send, createEvents } from "../lib/testEvents";

export const sendTestEvents = inngest.createFunction(
  { name: "Send test events" },
  { cron: "*/2 * * * *" },
  async ({ step }) => {
    const n = 50;

    console.log("Send test events invoked");

    const events = await step.run("Generate events", () => {
      return createEvents(n);
    });

    await step.run("Send events", () => send(events));
    return {
      success: true,
      message: `sent ${n} events`,
    };
  }
);
