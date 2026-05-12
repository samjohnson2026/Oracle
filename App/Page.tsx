'use client';
import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Send, Zap, Bot, Brain, Sparkles, Code, Search } from 'lucide-react';

const MODELS = [
  { id: 'chatgpt', name: 'ChatGPT 5.5', icon: <Zap className="text-green-400" /> },
  { id: 'claude', name: 'Claude 4 Opus', icon: <Brain className="text-orange-400" /> },
  { id: 'gemini', name: 'Gemini 3.1 Ultra', icon: <Bot className="text-blue-400" /> },
  { id: 'grok', name: 'Grok 4.3', icon: <Sparkles className="text-pink-400" /> },
  { id: 'deepseek', name: 'DeepSeek V3.2', icon: <Code className="text-cyan-400" /> },
  { id: 'copilot', name: 'Copilot (Web)', icon: <Search className="text-indigo-400" /> },
];

export default function ComparisonPage() {
  const [input, setInput] = useState('');
  
  // Initialize hooks for all 6 models
  const apiCalls = MODELS.map(m => ({
    ...m,
    ...useCompletion({ api: '/api/chat', body: { modelId: m.id } })
  }));

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    apiCalls.forEach(call => call.complete(input));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          AI Nexus
        </h1>
        <p className="text-gray-500">Universal OpenRouter Comparison Tool</p>
      </header>

      <form onSubmit={handleCompare} className="max-w-3xl mx-auto mb-12 sticky top-6 z-10">
        <div className="flex gap-2 p-2 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
          <input 
            className="flex-1 bg-transparent p-4 outline-none text-lg" 
            placeholder="Enter a prompt to test all models..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-white text-black px-6 rounded-xl font-bold hover:bg-blue-400 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiCalls.map((call) => (
          <div key={call.id} className="bg-gray-950 border border-gray-800 rounded-3xl flex flex-col h-[600px] shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-900 flex items-center gap-3 bg-gray-900/50">
              {call.icon}
              <span className="font-bold">{call.name}</span>
              {call.isLoading && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-ping" />}
            </div>
            <div className="p-6 overflow-y-auto text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {call.completion || <span className="text-gray-700 italic">Awaiting prompt...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
