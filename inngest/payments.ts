import casual from 'casual';
import { inngest } from './client';

export const handleFailedPayments = inngest.createFunction(
  { name: 'Handle failed payments', id: 'handle-failed-payments' },
  { event: 'billing/payment.failed' },
  async ({ event, step, attempt }) => {
    // await step.run('step-1', async () => {
    //   if (attempt <= 4) {
    //     throw Error(`whoops - ${attempt}`);
    //   }
    // });
    // await step.run('step-2', async () => {
    //   throw Error(`whoops - ${attempt}`);
    // });

    const output = await step.run(
      'fetch-subscription-from-stripe',
      async () => {
        return { customerId: 'cus_1234567890' };
      }
    );

    await step.run('downgrade-account-billing-plan', async () => {
      if (casual.random > 0.5) {
        throw new Error('Failed to downgrade user');
      }
      return {
        message: `downgraded user ${event.data.userId || ''}`,
      };
    });

    return 'ok!';
  }
);

export const sendBillingReceipt = inngest.createFunction(
  { name: 'Send billing receipt', id: 'send-billing-receipt' },
  { event: 'billing/payment.succeeded' },
  async ({ event }) => {
    return {
      success: true,
      message: `Invoice sent`,
    };
  }
);

export const sendSlackNotification = inngest.createFunction(
  { name: 'Send Slack notification', id: 'send-slack-notification' },
  { event: 'billing/subscription.started' },
  async ({ event }) => {
    return {
      success: true,
      message: `Slack notification sent`,
    };
  }
);

export const sendOfferDiscountForFeedback = inngest.createFunction(
  { name: 'Send discount offer for user feedback', id: 'send-discount-offer' },
  { event: 'billing/subscription.cancelled' },
  async ({ event }) => {
    return {
      success: true,
      message: `discount offer sent`,
    };
  }
);
