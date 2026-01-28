import { inngest } from './client';

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1]?.trim() || '';
    const description = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim() || '';
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();

    if (title && link) {
      items.push({ title, link, description, pubDate });
    }
  }

  return items;
}

export const RssFeedFetch = inngest.createFunction(
  {
    name: 'RSS Feed Fetch',
    id: 'rss-feed-fetch'
  },
  [
    { event: 'rss/fetch-feed' },
    { cron: '15 */1 * * *' }
  ],
  async ({ event, step }) => {
    const rssUrl = (event?.data && 'url' in event.data ? event.data.url : undefined) || 'https://www.espn.com/espn/rss/mlb/news';

    const feedXml = await step.run('fetch-rss-feed', async () => {
      const response = await fetch(rssUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status}`);
      }
      return response.text();
    });

    const items = await step.run('parse-rss-feed', () => {
      return parseRss(feedXml);
    });

    await step.sendEvent(
      'send-story-events',
      items.map((item) => ({
        name: 'rss/story-fetched',
        data: {
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
          feedUrl: rssUrl,
        },
      }))
    );

    return { storiesFound: items.length, feedUrl: rssUrl };
  }
);
