import { callbackify } from 'util';
import { inngest } from './client';
import casual from 'casual';

export const sendWelcomeEmail = inngest.createFunction(
  { name: 'Send Welcome Email', id: 'send-welcome-email' },
  { event: 'app/account.created' },
  async ({ event }) => {
    return {
      success: true,
      message: `welcome email sent to user: ${event.user.id}`,
    };
  }
);

export const sendUpgradeEmail = inngest.createFunction(
  { name: 'Send Upgrade Email', id: 'send-upgrade-email' },
  { event: 'billing/subscription.started' },
  async ({ event }) => {
    return {
      success: true,
      message: `upgrade email sent to user: ${event.user.id}`,
    };
  }
);

export const sendDailyDigest = inngest.createFunction(
  { name: 'Send Daily Digest', id: 'send-daily-digest' },
  { cron: '0 9 * * *' },
  async ({ event, step }) => {
    const userList = await step.run('fetch-user-emails', () => {
      return casual
        .array_of_words(casual.integer(27, 47))
        .map(() => ({ id: casual.uuid, email: casual.email }));
    });

    for (const user of userList) {
      await step.run(`send-digest-email`, async () => {
        return {
          success: true,
          message: `Digest sent to ${user.email}`,
        };
      });
    }

    return {
      success: true,
      message: `Digest sent to ${userList.length} users`,
    };
  }
);
