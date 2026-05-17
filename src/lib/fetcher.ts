export class FetchError extends Error {
  status?: number;
  info?: unknown;
}

export default async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    const info = (await res.json()) as unknown;
    error.status = res.status;
    error.info = info;
    throw error;
  }

  return (await res.json()) as JSON;
}
