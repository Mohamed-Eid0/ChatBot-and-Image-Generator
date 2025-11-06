import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import ImageGenerator from './components/ImageGenerator';
import { Bot, Image as ImageIcon } from 'lucide-react';

type Tab = 'chat' | 'image';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chatbot />;
      case 'image':
        return <ImageGenerator />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none ${
        activeTab === tabName
          ? 'bg-emerald-500 text-white'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen antialiased text-gray-800 bg-white">
      <header className="p-4 text-center border-b border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
          Gemini Creative Studio
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full flex flex-col">
          <nav className="flex border-b border-gray-200">
            <TabButton tabName="chat" label="Chatbot" icon={<Bot size={18} />} />
            <TabButton tabName="image" label="Image Generator" icon={<ImageIcon size={18} />} />
          </nav>
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;