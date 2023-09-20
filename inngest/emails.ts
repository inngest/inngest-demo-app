import { inngest } from './client';

export const sendWelcomeEmail = inngest.createFunction(
  { name: 'Send Welcome Email' },
  { event: 'app/account.created' },
  async ({ event }) => {
    return {
      success: true,
      message: `welcome email sent to user: ${event.user.id}`,
    };
  }
);

export const sendUpgradeEmail = inngest.createFunction(
  { name: 'Send Upgrade Email' },
  { event: 'billing/subscription.started' },
  async ({ event }) => {
    return {
      success: true,
      message: `upgrade email sent to user: ${event.user.id}`,
    };
  }
);

export const sendChurnEmail = inngest.createFunction(
  { name: 'Send Churn Email' },
  { event: 'billing/subscription.cancelled' },
  async ({ event }) => {
    return {
      success: true,
      message: `churn email sent to user: ${event.user.id}`,
    };
  }
);
