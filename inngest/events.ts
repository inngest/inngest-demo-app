export type AppAccountCreated = {
  name: 'app/account.created';
  data: {
    email: string;
    userId: string;
  };
};

export type BillingPaymentFailed = {
  name: 'billing/payment.failed';
  data: {
    billingPlan: string;
    paymentId: string;
    reason: string;
    userId: string;
  };
};

export type BillingPaymentSucceeded = {
  name: 'billing/payment.succeeded';
  data: {
    billingPlan: string;
    paymentId: string;
    amount: number;
    userId: string;
  };
};

export type BillingSubscriptionStarted = {
  name: 'billing/subscription.started';
  data: {
    billingPlan: string;
    amount: number;
    userId: string;
  };
};

export type BillingSubscriptionCancelled = {
  name: 'billing/subscription.cancelled';
  data: {
    billingPlan: string;
    amount: number;
    userId: string;
  };
};

export type AIChatCompletion = {
  name: 'ai/chat.completion';
  data: {
    messages: {
      role: 'system' | 'user' | 'assistant';
      content: string;
    }[];
  };
};

export type AISummarizeContent = {
  name: 'ai/summarize.content';
  data: {
    content: string;
    transcript: string;
  };
};

export type AIVideoUploaded = {
  name: 'ai/video.uploaded';
  data: {};
};

export type ImportSourceConnected = {
  name: 'integrations/source.connected';
  data: {};
};
export type ImportSourceRemoved = {
  name: 'integrations/source.removed';
  data: {};
};
type ExportRequested = {
  name: 'integrations/export.requested';
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
  | AIChatCompletion
  | AISummarizeContent
  | AIVideoUploaded
  | ImportSourceConnected
  | ImportSourceRemoved
  | ExportRequested;

// A simple way to pass events without having to re-type the event name
type CustomEvents<T extends Record<keyof T, any>> = {
  [V in T[keyof T]]: {
    [K in keyof T]: T[K] extends V ? T : never;
  }[keyof T];
};

export type Events = CustomEvents<EventUnion>;
