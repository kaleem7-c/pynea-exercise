import { graphqlRequest } from './graphql-client';

describe('graphqlRequest', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns data on a successful response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { pokemon: { name: 'pikachu' } } }),
    }) as unknown as typeof fetch;

    const result = await graphqlRequest<{ pokemon: { name: string } }>('query {}');
    expect(result).toEqual({ pokemon: { name: 'pikachu' } });
  });

  it('throws when the HTTP response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(graphqlRequest('query {}')).rejects.toThrow('GraphQL request failed with status 500');
  });

  it('throws when the response contains GraphQL errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ errors: [{ message: 'Not found' }] }),
    }) as unknown as typeof fetch;

    await expect(graphqlRequest('query {}')).rejects.toThrow('Not found');
  });

  it('throws when the response has no data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await expect(graphqlRequest('query {}')).rejects.toThrow('GraphQL response contained no data');
  });
});
