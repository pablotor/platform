const HTTP_METHODS = [
  'get',
  'head',
  'options',
  'trace',
  'put',
  'delete',
  'post',
  'patch',
  'connect',
] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

type RequestPayload = Record<string, unknown> | FormData;
type RequestReturnType = unknown;

export class FetchError extends Error {
  public readonly method: HttpMethod;
  public readonly url: string;
  public readonly responseStatus: number;
  public readonly responseText: string;

  constructor(
    method: HttpMethod,
    url: string,
    responseStatus: number,
    responseText: string,
  ) {
    super(
      `${method} request to ${url} failed with status ${responseStatus}. ${responseText}`,
    );
    this.method = method;
    this.url = url;
    this.responseStatus = responseStatus;
    this.responseText = responseText;
  }
}

const payloadToQueryString = (payload: RequestPayload): string => {
  const payloadEntries =
    payload instanceof FormData
      ? Array.from(payload.entries())
      : Object.entries(payload);
  const queryString = payloadEntries
    .map(
      ([paranName, paramValue]) =>
        `${paranName}=${encodeURIComponent(paramValue as string | number | boolean)}`,
    )
    .join('&');
  return `?${queryString}`;
};

const baseRequest = async <
  R extends RequestReturnType,
  T extends RequestPayload | void,
>(
  baseUrl: string,
  path: string,
  method: HttpMethod = 'get',
  payload?: T,
  options?: {
    headers?: HeadersInit;
  },
) => {
  const url = new URL(path, encodeURI(baseUrl));
  if (method === 'get' && payload) {
    url.search = payloadToQueryString(payload);
  }

  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers: options?.headers,
  };

  if (method !== 'get' && payload) {
    if (payload instanceof FormData) {
      requestOptions.body = payload;
    } else {
      requestOptions.body = JSON.stringify(payload);
    }
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new FetchError(
      method,
      url.href,
      response.status,
      await response.text(),
    );
  }

  return {
    data: (await response.json()) as R,
    statusText: response.statusText,
    status: response.status,
    headers: response.headers,
  };
};

type HttpMethodFn = <
  R extends RequestReturnType = void,
  T extends RequestPayload | void = void,
>(
  path: string,
  payload?: T,
  options?: {
    headers?: HeadersInit;
  },
) => Promise<{
  data: R;
  statusText: string;
  status: number;
  headers: Headers;
}>;

export const generateRequestClient = (baseUrl: string) =>
  Object.fromEntries(
    HTTP_METHODS.map((method) => [
      method,
      <
        R extends RequestReturnType = void,
        T extends RequestPayload | void = void,
      >(
        path: string,
        payload?: T,
        options?: {
          headers?: HeadersInit;
        },
      ) => baseRequest<R, T>(baseUrl, path, method, payload, options),
    ]),
  ) as Record<HttpMethod, HttpMethodFn>;

const generateApiClient = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl)
    throw new Error(
      'ApiClient Error: Base url not defined. Add your NEXT_PUBLIC_API_URL to your .env',
    );

  return generateRequestClient(apiUrl);
};

const apiClient = generateApiClient();

export default apiClient;
