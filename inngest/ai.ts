import casual from 'casual';
import { inngest } from './client';
import { NonRetriableError } from 'inngest';
import { post, get, createSpan } from '../lib/utils';

// A centralized function to handle all chat completions to respect a global
// limit for a given OpenAI API.
export const chatCompletion = inngest.createFunction(
  {
    name: 'Create chat completion',
    id: 'create-chat-completion',
    throttle: { limit: 5, period: '60s' },
  },
  { event: 'ai/chat.completion' },
  async ({ event, step }) => {
    /* You might use the OpenAI API like this here:
    const completion = await openai.chat.completions.create({
      messages:
        event.data.messages,
      model: 'gpt-3.5-turbo',
    });
    return completion;
    */
    // Here is a fake response for testing purposes
    if (Math.random() > 0.7) {
      throw new NonRetriableError(
        'BadRequestError: 400 Your input exceeds the context window of this model. Please adjust your input and try again.',
      );
    }
    return await post('https://api.openai.com/v1/chat/completions', 1500, {
      choices: [
        {
          finish_reason: 'stop',
          index: 0,
          message: {
            content: `You sure about that? You sure that's not why?...`,
            role: 'assistant',
          },
          logprobs: null,
        },
      ],
      created: 1677664795,
      id: 'chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW',
      model: 'gpt-3.5-turbo-0613',
      object: 'chat.completion',
      usage: {
        completion_tokens: 17,
        prompt_tokens: 57,
        total_tokens: 74,
      },
    });
  },
);

/*
{
  "name": "ai/summarize.content",
  "data": {
    "content": "Carber Vac product release summary",
    "transcript": "s3://product-ideas/carber-vac-release.txt"
  }
}
*/
export const summarizeContent = inngest.createFunction(
  {
    name: 'Summarize content via GPT-4',
    id: 'summarize-content',
  },
  { event: 'ai/summarize.content' },
  async ({ event, step, attempt }) => {
    const results = await step.run('query-vectordb', async () => {
      await createSpan(
        'INDEX SEARCH',
        {
          'db.host': 'gcp-124975.pinecone.io',
          'db.namespace': 'ns1',
          'db.query': `{ "inputs": { "text" : "${event.data.content}" }, "topK": 3 }`,
          'db.results_count': 7,
        },
        65,
      );
      return {
        matches: [
          {
            id: 'vec3',
            score: 0,
            values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
            text: casual.sentences(3),
          },
          {
            id: 'vec4',
            score: 0.0799999237,
            values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
            text: casual.sentences(3),
          },
          {
            id: 'vec2',
            score: 0.0800000429,
            values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
            text: casual.sentences(3),
          },
        ],
        namespace: 'ns1',
        usage: { readUnits: 6 },
      };
    });

    const transcript = await step.run('read-s3-file', async () => {
      return await get(
        'https://s3.amazonaws.com/product-ideas/carber-vac-release.txt',
        420,
        casual.sentences(10),
      );
    });

    // We can globally share throttle limited functions like this using invoke
    const completion = await step.invoke('generate-summary-via-gpt-4', {
      function: chatCompletion,
      data: {
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summaries content for product launches.',
          },
          {
            role: 'user',
            content: `Question: Summarize my content: \n${transcript}. \nInformation: ${results.matches
              .map((m) => m.text)
              .join('. ')}`,
          },
        ],
      },
    });
    // You might use the response like this:
    const summary = completion.choices[0].message.content;

    await step.run('save-to-db', async () => {
      const id = casual.uuid;
      return await createSpan(
        'INSERT',
        {
          'db.operation': 'INSERT',
          'db.table': 'summaries',
          'db.document.id': id,
        },
        30,
      );
      return id;
    });

    await step.run('websocket-push-to-client', async () => {
      await createSpan(
        'websocket:connect:realtime_ai',
        {
          'messaging.system': 'socket.io',
          'messaging.destination': 'realtime_ai',
          'messaging.operation': 'receive',
          'messaging.socket.io.event_name': 'chat_message',
        },
        12,
      );
      return await createSpan(
        'websocket:write_message:realtime_ai',
        {
          'messaging.system': 'socket.io',
          'messaging.destination': 'realtime_ai',
          'messaging.operation': 'receive',
          'messaging.socket.io.event_name': 'chat_message',
        },
        34,
      );
    });
    return { success: true, summaryId: casual.uuid };
  },
);

// export const summarizeContent2 = inngest.createFunction(
//   { name: 'Summarize content via GPT-4 (v2)', id: 'summarize-content-v2' },
//   { event: 'ai/summarize.content', if: "event.v == '2024-04-04.01'" },
//   async ({ event, step, attempt }) => {
//     return { success: true, summaryId: casual.uuid };
//   }
// );

export const generateTranscript = inngest.createFunction(
  { name: 'Generate video transcript', id: 'generate-transcript' },
  { event: 'ai/video.uploaded' },
  async ({ event, step, attempt }) => {
    await step.run('generate-summary-via-gpt-4', async () => {
      return {
        id: casual.uuid,
        response: `You sure about that? You sure that's not why?...`,
      };
    });
    await step.run('save-to-db', async () => {
      const id = casual.uuid;
      await createSpan(
        'INSERT',
        {
          'db.operation': 'INSERT',
          'db.table': 'summary',
          'db.document.id': id,
        },
        30,
      );
      return id;
    });

    await step.run('websocket-push-to-client', async () => {
      return casual.uuid;
    });
    return { success: true, summaryId: casual.uuid };
  },
);

export const runimport = inngest.createFunction(
  { name: 'Import data pipeline', id: 'import-data' },
  { event: 'integrations/source.connected' },
  async ({ event, step, attempt }) => {
    if (Math.random() > 0.3) {
      throw new NonRetriableError('Failed to fetch user data');
    }
    if (Math.random() > 0.1) {
      throw new NonRetriableError('Invalid access token');
    }
    return true;
  },
);

export const sourceremoved = inngest.createFunction(
  { name: 'Delete integration data', id: 'cleanup-data' },
  { event: 'integrations/source.removed' },
  async ({ event, step, attempt }) => {
    return true;
  },
);

export const exportData = inngest.createFunction(
  {
    name: 'Data warehouse sync',
    id: 'export',
    debounce: { period: '30s' },
  },
  { event: 'integrations/export.requested' },
  async ({ event, step, attempt }) => {
    await step.sleep('delay', '2m');
    return true;
  },
);
