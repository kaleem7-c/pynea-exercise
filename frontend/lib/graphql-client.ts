function getGraphqlUrl(): string {
  const url = process.env.GRAPHQL_URL;
  if (!url) {
    throw new Error('GRAPHQL_URL must be set (see .env.example)');
  }
  return url;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

// Single contact with GraphQL API, easier to swap for something like apollo later
export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: false },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join('; '));
  }

  if (!result.data) {
    throw new Error('GraphQL response contained no data');
  }

  return result.data;
}
