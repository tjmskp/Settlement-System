'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  unread: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Settlement Agent',
    lastMessage: "I've reviewed the documents you sent.",
    unread: 2,
    messages: [
      {
        id: '1',
        content: "Hello, I've received your settlement documents.",
        sender: 'John Smith',
        timestamp: '10:30 AM',
        isCurrentUser: false
      },
      {
        id: '2',
        content: 'Great, thank you for confirming.',
        sender: 'You',
        timestamp: '10:35 AM',
        isCurrentUser: true
      },
      {
        id: '3',
        content: "I've reviewed the documents you sent.",
        sender: 'John Smith',
        timestamp: '10:40 AM',
        isCurrentUser: false
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Legal Advisor',
    lastMessage: 'The contract looks good to proceed.',
    unread: 0,
    messages: [
      {
        id: '1',
        content: "I've reviewed the contract.",
        sender: 'Sarah Johnson',
        timestamp: '9:30 AM',
        isCurrentUser: false
      },
      {
        id: '2',
        content: 'Do you have any concerns?',
        sender: 'You',
        timestamp: '9:35 AM',
        isCurrentUser: true
      },
      {
        id: '3',
        content: 'The contract looks good to proceed.',
        sender: 'Sarah Johnson',
        timestamp: '9:40 AM',
        isCurrentUser: false
      }
    ]
  }
];

export default function Messages() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Here you would normally send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedConversation.id === conversation.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
                    <p className="text-xs text-gray-500">{conversation.role}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{selectedConversation.name}</h2>
          <p className="text-sm text-gray-500">{selectedConversation.role}</p>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-lg ${
                    message.isCurrentUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 