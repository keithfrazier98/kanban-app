import { setupWorker } from "msw";
import { handlers } from "./handlers";

// This configures a Service Worker with the given request
export const worker = setupWorker(...handlers);

export async function client(
  endpoint: string,
  {
    body,
    ...customConfig
  }: { body?: any; headers?: any; method?: "POST" | "GET" } = {}
) {
  const headers = { "Content-Type": "application/json" };

  const config: {
    method: "GET" | "POST";
    headers: any;
    body?: any;
  } = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig?.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      };
    }
    throw new Error(response.statusText);
  } catch (err: any) {
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, body });
};
