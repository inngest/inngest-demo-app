import opentelemetry from '@opentelemetry/api';

const tracer = opentelemetry.trace.getTracer('inngest-demo-app');

function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function createSpan(
  name: string,
  attributes: Record<string, any>,
  duration: number
) {
  const span = await tracer.startSpan(name, {
    attributes: attributes,
  });

  await sleep(duration);

  await span.end();
}

export async function get(url: string, duration: number, mockResponse: any) {
  const urlParts = new URL(url);
  await createSpan(
    'GET',
    {
      'http.request.method': 'GET',
      'http.request.method_original': 'GET',
      'http.response.status_code': 200,
      // 'network.peer.address': '::1',
      // 'network.peer.port': 8288,
      // 'server.address': 'localhost',
      // 'server.port': 80,
      'url.full': url,
      'url.path': urlParts.pathname,
      'url.query': urlParts.search || '',
      'url.scheme': urlParts.protocol,
      'user_agent.original': 'node',
    },
    duration
  );
  return mockResponse;
}

export async function post(url: string, duration: number, mockResponse: any) {
  const urlParts = new URL(url);
  await createSpan(
    'POST',
    {
      'http.request.method': 'POST',
      'http.request.method_original': 'POST',
      'http.response.status_code': 200,
      // 'network.peer.address': '::1',
      // 'network.peer.port': 8288,
      // 'server.address': 'localhost',
      // 'server.port': 80,
      'url.full': url,
      'url.path': urlParts.pathname,
      'url.query': urlParts.search || '',
      'url.scheme': urlParts.protocol,
      'user_agent.original': 'node',
    },
    duration
  );
  return mockResponse;
}
