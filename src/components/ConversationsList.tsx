import React, { useState } from 'react';
import { MessageSquare, Plus, Menu, X, Clock, ChevronRight, Trash2, Eraser } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClearMessages: (id: string) => void;
}

export function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearMessages,
}: ConversationsListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering conversation selection
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  const handleClear = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to clear all messages in this conversation?')) {
      onClearMessages(id);
    }
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 sm:top-4 left-3 sm:left-4 z-20 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-full bg-white z-40 w-[85vw] sm:w-80 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewConversation();
              setIsOpen(false);
            }}
            className="mx-4 mt-4 mb-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>New Conversation</span>
          </button>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group border-b border-gray-100 ${
                  activeConversationId === conv.id ? 'bg-blue-50/80' : ''
                }`}
              >
                <button
                  onClick={() => {
                    onSelectConversation(conv.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-4 hover:bg-gray-50 flex items-center gap-3 transition-colors relative"
                >
                  <MessageSquare 
                    size={20} 
                    className={activeConversationId === conv.id ? 'text-blue-600' : 'text-gray-500'} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{conv.title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock size={12} />
                      <span>{conv.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleClear(e, conv.id)}
                      className="p-2 rounded-full hover:bg-yellow-100 text-gray-400 hover:text-yellow-600 transition-colors"
                      aria-label="Clear messages"
                    >
                      <Eraser size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, conv.id)}
                      className="p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete conversation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
