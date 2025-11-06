import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageStream } from '../services/geminiService';
import { Send, User, Bot } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-2xl px-5 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-emerald-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-700" />
        </div>
      )}
    </div>
  );
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
        const savedMessages = localStorage.getItem('gemini-chat-history');
        return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
        console.error("Failed to parse chat history from localStorage", error);
        return [];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Don't save the initial empty array from the first render
    if (messages.length > 0) {
        localStorage.setItem('gemini-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelMessage: ChatMessage = { role: 'model', content: '' };
    setMessages((prev) => [...prev, modelMessage]);

    await sendMessageStream(input, (chunk) => {
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
        )
      );
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
           <div className="flex items-start gap-4 my-4">
             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="max-w-md md:max-w-2xl px-5 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                <LoadingSpinner size={20} />
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-emerald-500 rounded-full text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;