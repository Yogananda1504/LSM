import { LangflowResponse } from './types';

export class LangflowClient {
  constructor(private baseURL: string, private applicationToken: string) {
    if (!baseURL) throw new Error('API base URL is required');
    if (!applicationToken) throw new Error('Please provide your LangFlow token in the .env file (VITE_LANGFLOW_TOKEN)');
  }

  private async validateJsonResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await response.text();
      console.error('Received non-JSON response:', errorText);
      throw new TypeError("Response was not JSON");
    }
    return await response.json();
  }

  async post(endpoint: string, body: any, headers: Record<string, string> = {}) {
    if (!endpoint) throw new Error('Endpoint is required');

    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${this.applicationToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...headers
        },
        body: JSON.stringify(body)
      });

      const responseData = await this.validateJsonResponse(response);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return responseData;
    } catch (error) {
      console.error('Request failed:', error);
      throw error instanceof Error ? error : new Error('An unknown error occurred');
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