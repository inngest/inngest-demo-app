export type AppAccountCreated = {
  name: 'app/account.created';
  data: {
    email: string;
  };
  user: {
    id: string;
  };
};

export type BillingPaymentFailed = {
  name: 'billing/payment.failed';
  data: {
    billingPlan: string;
    paymentId: string;
    reason: string;
  };
  user: {
    id: string;
  };
};

export type BillingPaymentSucceeded = {
  name: 'billing/payment.succeeded';
  data: {
    billingPlan: string;
    paymentId: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type BillingSubscriptionStarted = {
  name: 'billing/subscription.started';
  data: {
    billingPlan: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type BillingSubscriptionCancelled = {
  name: 'billing/subscription.cancelled';
  data: {
    billingPlan: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type AISummarizeContent = {
  name: 'ai/summarize.content';
  data: {
    content: string;
    transcript: string;
  };
};

// Scripts use this type externally
export type EventUnion =
  | AppAccountCreated
  | BillingPaymentFailed
  | BillingPaymentSucceeded
  | BillingSubscriptionStarted
  | BillingSubscriptionCancelled
  | AISummarizeContent;

// A simple way to pass events without having to re-type the event name
type CustomEvents<T extends Record<keyof T, any>> = {
  [V in T[keyof T]]: {
    [K in keyof T]: T[K] extends V ? T : never;
  }[keyof T];
};

export type Events = CustomEvents<EventUnion>;
