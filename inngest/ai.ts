import casual from 'casual';
import { inngest } from './client';

export const summarizeContent = inngest.createFunction(
  { name: 'Summarize content (GPT-4 RAG flow)', id: 'summarize-content' },
  { event: 'ai/summarize.content' },
  async ({ event, step, attempt }) => {
    await step.run('query-vectordb', async () => {
      return {
        matches: [
          {
            id: 'vec3',
            score: 0,
            values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
          },
          {
            id: 'vec4',
            score: 0.0799999237,
            values: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
          },
          {
            id: 'vec2',
            score: 0.0800000429,
            values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
          },
        ],
        namespace: 'ns1',
        usage: { readUnits: 6 },
      };
    });
    await step.run('generate-summary-via-gpt-4', async () => {
      return {
        id: casual.uuid,
        response: `You sure about that? You sure that's not why?...`,
      };
    });
    await step.run('save-to-db', async () => {
      return casual.uuid;
    });

    await step.run('websocket-push-to-client', async () => {
      return casual.uuid;
    });
    return { success: true, summaryId: casual.uuid };
  }
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
