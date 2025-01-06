import React, { useState } from 'react';
import { LangflowClient } from './lib/langflow-client';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { MessageSquare, Eraser, Sparkles } from 'lucide-react';
import { API_CONFIG } from './lib/config';
import { Message } from './lib/types';
import { ConversationsList } from './components/ConversationsList';

type ExtendedMessage = Message & { imageSrc?: string };

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: ExtendedMessage[];
}

// Initialize the LangFlow client with proxy URL
const token = import.meta.env.VITE_LANGFLOW_TOKEN;
const client = new LangflowClient('/api/langflow', token);

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      timestamp: new Date(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const handleSendMessage = async (message: string, imageSrc?: string) => {
    if (!activeConversationId) {
      createNewConversation();
    }

    try {
      setIsLoading(true);
      // Add user message
      const userMessage = { text: message, isBot: false, imageSrc };
      updateConversationMessages(userMessage);

      // Send to API and handle response
      const response = await client.runFlow(API_CONFIG.FLOW_ID, API_CONFIG.LANGFLOW_ID, message);
      
      if (!response?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
        throw new Error('Invalid response format from API');
      }

      const botMessage = {
        text: response.outputs[0].outputs[0].outputs.message.message.text,
        isBot: true
      };
      updateConversationMessages(botMessage);

      // Update conversation title if it's the first message
      if (activeConversation?.messages.length === 0) {
        updateConversationTitle(message);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: `Sorry, there was an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isBot: true
      };
      updateConversationMessages(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationMessages = (message: ExtendedMessage) => {
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId
        ? { ...conv, messages: [...conv.messages, message] }
        : conv
    ));
  };

  const updateConversationTitle = (firstMessage: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === activeConversationId
        ? { ...conv, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') }
        : conv
    ));
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleClearMessages = (id: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id
        ? { ...conv, messages: [], title: 'New Conversation' }
        : conv
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <ConversationsList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onClearMessages={handleClearMessages}
      />
      
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        <header className="bg-gradient-to-r from-white via-blue-50 to-white border-b border-blue-100 shadow-sm flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-6 pl-12 sm:pl-8">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="relative hidden sm:block">
                  <MessageSquare className="text-blue-600 transform transition-transform hover:scale-110" size={28} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent truncate">
                    Chatbot Assistant
                  </h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1 hidden sm:flex">
                    <Sparkles size={12} className="text-yellow-500" />
                    Powered by AI
                  </p>
                </div>
              </div>
              
              {activeConversationId && (
                <button
                  onClick={() => handleClearMessages(activeConversationId)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-yellow-600 hover:text-yellow-700 
                    hover:bg-yellow-50 rounded-full transition-all duration-200 group shrink-0"
                >
                  <Eraser size={16} className="transform transition-transform group-hover:rotate-12" />
                  <span className="font-medium hidden sm:inline">Clear chat</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto py-4 sm:py-6">
              {activeConversationId ? (
                <div className="space-y-6 pb-32">
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message.text}
                      isBot={message.isBot}
                      imageSrc={message.imageSrc}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage
                      message=""
                      isBot={true}
                      isLoading={true}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={createNewConversation}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start New Conversation
                  </button>
                </div>
              )}
            </div>
          </div>

          {activeConversationId && (
            <div className="flex-shrink-0 bg-gradient-to-t from-gray-100 to-transparent pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;