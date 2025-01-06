import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-gray-200 backdrop-blur-sm">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-0"
        onClick={() => {/* Implement emoji picker */}}
      >
        <Smile size={22} className="sm:w-6 sm:h-6" />
      </button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="Type your message..."
        className="flex-1 text-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-[14px] sm:text-[15px] transition-all"
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-blue-600 text-white rounded-lg px-4 sm:px-6 py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group shrink-0"
      >
        <Send size={18} className="sm:w-5 sm:h-5 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </button>
    </form>
  );
}