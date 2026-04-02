export type HealthResponse = {
  status: string;
  service: string;
};

export type RuntimeStatusResponse = {
  installed: boolean;
  bridge_status: string;
  latest_error: string | null;
};

export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
