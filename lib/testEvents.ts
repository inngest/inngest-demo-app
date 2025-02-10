import { inngest } from '../inngest/index';
import type { EventUnion, Events } from '../inngest/events';
import casual from 'casual';

// We re-use user ids to ensure that some users have multiple events
const USER_IDS = [
  '211bdb20-0708-4a65-b07e-9ceb73fd9f36',
  '25b06b25-9432-4213-ad58-701de2faa169',
  'c6d3ad5b-c38d-4823-a8c5-c014258a4a7b',
  'bdce1b1b-6e3a-43e6-84c2-2deb559cdde6',
  'cb1518b8-a4dd-4628-9cde-67625777cbe4',
  '5f8996f5-fec8-43f1-9919-ba56d1b75349',
  '17ca4ff6-45ea-4149-9b48-6fa935b8323a',
  'ec8e1911-a6fd-490b-af92-2d7659a680d8',
  'd258a90d-7d73-4eb8-909e-c2b210330e7c',
  '5d66e25b-6d71-41a2-9ba3-7e9290b5d0e8',
];

const BILLING_PLANS: Record<string, number> = {
  hobby: 0,
  pro: 20,
  enterprise: 1000,
};

type EventNames = Pick<EventUnion, 'name'>['name'];
const EVENTS: EventNames[] = [
  'app/account.created',
  // 'billing/payment.succeeded',
  'billing/payment.failed',
  // 'billing/subscription.started',
  // 'billing/subscription.cancelled',
  'integrations/source.connected',
  'integrations/source.removed',
  'integrations/export.requested',
  'ai/summarize.content',
  'ai/video.uploaded',
];

function createRandomEventData<Evt, T extends EventNames>(
  name: T
): Pick<Events[T], 'data'>['data'] {
  const billingPlan: keyof typeof BILLING_PLANS = casual.random_element(
    Object.keys(BILLING_PLANS)
  );
  switch (name) {
    case 'app/account.created':
      return {
        email: casual.email,
      };
    case 'billing/payment.succeeded':
      return {
        billingPlan,
        paymentId: casual.uuid,
        amount: BILLING_PLANS[billingPlan],
      };
    case 'billing/payment.failed':
      return {
        billingPlan,
        paymentId: casual.uuid,
        reason: casual.word,
      };
    case 'billing/subscription.started':
    case 'billing/subscription.cancelled':
      return {
        billingPlan,
        amount: BILLING_PLANS[billingPlan],
      };
    case 'ai/summarize.content':
      return {
        content: `${casual.company_name} ${casual.word} ${casual.word}`,
        transcript: 's3://product-ideas/carber-vac-release.txt',
      };
    case 'ai/video.uploaded':
    case 'integrations/source.connected':
    case 'integrations/source.removed':
    case 'integrations/export.requested':
      return {
        content: `${casual.company_name} ${casual.word} ${casual.word}`,
        transcript: 's3://product-ideas/carber-vac-release.txt',
      };
  }
  throw new Error('Invalid event name');
}

function generateRandomTimestampWithinDays(days = 1): number {
  const start = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * days);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).valueOf();
}
type RandomEvent = {
  name: string;
  data: any;
  user?: any;
  ts?: number;
};
function createRandomEvent(eventName?: string, shouldDelay = true) {
  const name: EventNames = eventName || casual.random_element(EVENTS);
  const data = createRandomEventData(name);
  const payload: RandomEvent = {
    name,
    data: {
      ...data,
      userId: casual.random_element(USER_IDS),
    },
  };
  if (shouldDelay) {
    payload.ts = generateRandomTimestampWithinDays(1);
  }
  return payload;
}

export function createEvents(
  n: number,
  eventName?: string,
  shouldDelay = true
) {
  const events = [];
  for (let i = 0; i < n; i++) {
    events.push(createRandomEvent(eventName, shouldDelay));
  }
  return events;
}

export async function send(events: any[]) {
  try {
    await inngest.send(events);
  } catch (err) {
    console.log('ERROR!', err);
  }

  console.log('Events sent!');
}
