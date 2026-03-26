import { eventType, staticSchema } from 'inngest';

export const appAccountCreated = eventType('app/account.created', {
  schema: staticSchema<{ email: string; userId: string }>(),
});

export const billingPaymentFailed = eventType('billing/payment.failed', {
  schema: staticSchema<{
    billingPlan: string;
    paymentId: string;
    reason: string;
    userId: string;
  }>(),
});

export const billingPaymentSucceeded = eventType('billing/payment.succeeded', {
  schema: staticSchema<{
    billingPlan: string;
    paymentId: string;
    amount: number;
    userId: string;
  }>(),
});

export const billingSubscriptionStarted = eventType(
  'billing/subscription.started',
  {
    schema: staticSchema<{
      billingPlan: string;
      amount: number;
      userId: string;
    }>(),
  }
);

export const billingSubscriptionCancelled = eventType(
  'billing/subscription.cancelled',
  {
    schema: staticSchema<{
      billingPlan: string;
      amount: number;
      userId: string;
    }>(),
  }
);

export const aiChatCompletion = eventType('ai/chat.completion', {
  schema: staticSchema<{
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  }>(),
});

export const aiSummarizeContent = eventType('ai/summarize.content', {
  schema: staticSchema<{ content: string; transcript: string }>(),
});

export const aiVideoUploaded = eventType('ai/video.uploaded');
export const importSourceConnected = eventType('integrations/source.connected');
export const importSourceRemoved = eventType('integrations/source.removed');
export const exportRequested = eventType('integrations/export.requested');
