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

type RequestOptions<R extends RequestReturnType = RequestReturnType> = {
  headers?: HeadersInit;
  isPublic?: boolean;
  onSuccess?: (data: R) => void;
  onError?: (error: FetchError) => void;
};

const baseRequest = async <
  R extends RequestReturnType,
  T extends RequestPayload | void,
>(
  baseUrl: string,
  path: string,
  method: HttpMethod = 'get',
  payload?: T,
  options?: RequestOptions<R>,
) => {
  const url = new URL(path, encodeURI(baseUrl));
  const headers = new Headers(options?.headers);

  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers,
    credentials: options?.isPublic ? 'omit' : 'include',
  };

  if (payload) {
    if (method === 'get' && payload) {
      url.search = payloadToQueryString(payload);
    } else {
      if (payload instanceof FormData) {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
        requestOptions.body = payload;
      } else {
        headers.set('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(payload);
      }
    }
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const error = new FetchError(
      method,
      url.href,
      response.status,
      await response.text(),
    );
    if (!options?.onError) throw error;
    options.onError(error);
  }

  const data: R = await response.json().catch(() => undefined);

  options?.onSuccess?.(data);

  return {
    data,
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
  options?: RequestOptions<R>,
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
        options?: RequestOptions<R>,
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
