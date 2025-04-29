export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Unknown error");
    return data;
  }
  