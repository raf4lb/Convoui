export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type HttpHeaders = Record<string, string>;

export type HttpResponse = {
  status: number;
  data: unknown;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class HttpClient {
  private readonly defaultHeaders: HttpHeaders;

  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs = 5000,
    private readonly maxRetries = 2,
    defaultHeaders: HttpHeaders = {},
  ) {
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  /**
   * Executes fetch with timeout support using AbortController.
   */
  private async fetchWithTimeout(
    url: string,
    // eslint-disable-next-line no-undef
    options: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Core request handler with retry and error throwing.
   */
  private async request(
    method: HttpMethod,
    path: string,
    body?: unknown,
    headers: HttpHeaders = {},
    attempt = 0,
  ): Promise<HttpResponse> {
    const url = this.baseUrl + path;

    try {
      const response = await this.fetchWithTimeout(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
      }

      return {
        status: response.status,
        data,
      };
    } catch (error: any) {
      // Retry only for network / timeout errors
      if (attempt < this.maxRetries && this.isRetryableError(error)) {
        const backoffMs = 2 ** attempt * 100;
        await sleep(backoffMs);
        return this.request(method, path, body, headers, attempt + 1);
      }

      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Defines which errors are eligible for retry.
   */
  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    // AbortError (timeout) or generic network failure
    return error.name === "AbortError" || error.message.includes("Network");
  }

  get(path: string, headers?: HttpHeaders): Promise<HttpResponse> {
    return this.request("GET", path, undefined, headers);
  }

  post(path: string, body?: unknown, headers?: HttpHeaders): Promise<HttpResponse> {
    return this.request("POST", path, body, headers);
  }

  patch(path: string, body?: unknown, headers?: HttpHeaders): Promise<HttpResponse> {
    return this.request("PATCH", path, body, headers);
  }

  delete(path: string, headers?: HttpHeaders): Promise<HttpResponse> {
    return this.request("DELETE", path, undefined, headers);
  }
}
