import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isLoading?: boolean;
  imageSrc?: string;
}

export function ChatMessage({ message, isBot, isLoading, imageSrc }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex items-start gap-2 sm:gap-3 max-w-[88%] sm:max-w-[80%] ${isBot ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`p-2 sm:p-2.5 rounded-full ${
          isBot ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
        } shadow-sm transition-transform hover:scale-110 shrink-0`}>
          {isBot ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className={`p-3 sm:p-4 rounded-2xl ${
          isBot ? 'bg-blue-50 text-gray-800' : 'bg-green-50 text-gray-800'
        } shadow-sm transition-all hover:shadow-md break-words`}>
          {isLoading ? (
            <div className="flex gap-2 py-2 px-4">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed break-words">{message}</p>
          )}
          {!isLoading && imageSrc && (
            <img
              src={imageSrc}
              alt="Attachment"
              className="max-w-full h-auto mt-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            />
          )}
        </div>
      </div>
    </div>
  );
}