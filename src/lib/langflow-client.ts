import { LangflowResponse } from './types';

export class LangflowClient {
  constructor(private baseURL: string, private applicationToken: string) {
    if (!baseURL) {
      throw new Error('API base URL is required');
    }
    if (!applicationToken) {
      throw new Error('Please provide your LangFlow token in the .env file (VITE_LANGFLOW_TOKEN)');
    }
  }

  async post(endpoint: string, body: any, headers: Record<string, string> = {}) {
    if (!endpoint) throw new Error('Endpoint is required');

    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(body)
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return responseMessage;
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async runFlow(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType = 'chat',
    outputType = 'chat',
    tweaks = {}
  ): Promise<LangflowResponse> {
    if (!flowId || !langflowId || !inputValue) {
      throw new Error('flowId, langflowId, and inputValue are required');
    }

    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}`;
    return this.post(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks
    });
  }
}