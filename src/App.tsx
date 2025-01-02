import React, { useState } from 'react';
import { LangflowClient } from './lib/langflow-client';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MessageSquare } from 'lucide-react';
import { API_CONFIG } from './lib/config';
import { Message } from './lib/types';

// Initialize the LangFlow client with proxy URL
const token = import.meta.env.VITE_LANGFLOW_TOKEN;
const client = new LangflowClient('/api/langflow', token);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      // Validate input
      if (!message.trim()) return;

      // Add user message to chat
      setMessages(prev => [...prev, { text: message, isBot: false }]);
      setIsLoading(true);

      // Send message to LangFlow
      const response = await client.runFlow(
        API_CONFIG.FLOW_ID,
        API_CONFIG.LANGFLOW_ID,
        message
      );

      // Validate response structure
      if (!response?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
        throw new Error('Invalid response format from API');
      }

      // Extract bot response
      const botMessage = response.outputs[0].outputs[0].outputs.message.message.text;
      
      // Add bot response to chat
      setMessages(prev => [...prev, { text: botMessage, isBot: true }]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessages(prev => [...prev, { 
        text: `Sorry, there was an error: ${errorMessage}`,
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">AI Chat Assistant</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col">
        <div className="flex-1 space-y-6 mb-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isBot={message.isBot}
            />
          ))}
          {isLoading && (
            <ChatMessage
              message=""
              isBot={true}
              isLoading={true}
            />
          )}
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <MessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
              <p>Send a message to start the conversation!</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-100 pt-6">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;