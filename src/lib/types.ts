// API Types
export interface LangflowResponse {
  outputs: Array<{
    outputs: Array<{
      outputs: {
        message: {
          message: {
            text: string;
          };
        };
      };
    }>;
  }>;
}

export interface Message {
  text: string;
  isBot: boolean;
}