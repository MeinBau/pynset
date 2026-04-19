import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Place } from '../types';
import { Send, Mic, Sparkles, User, Bot } from 'lucide-react';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onSelectOption: (value: string) => void;
  isTyping?: boolean;
}

export default function Chat({ messages, onSendMessage, onSelectOption, isTyping }: ChatProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-bottom border-gray-100 flex items-center justify-between bg-white/80">
        <div className="flex items-center gap-3">
          {/* bg-blue-500 -> bg-emerald-600, shadow-blue-200 -> shadow-emerald-200 */}
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">PYNSET AI</h2>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              실시간 큐레이션 중
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* bg-blue-50 -> bg-emerald-50, text-blue-600 -> text-emerald-600 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                  ${msg.role === 'user' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-600'}
                `}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className="space-y-3">
                  {/* bg-blue-600 -> bg-emerald-600 */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
                  `}>
                    {msg.content}
                  </div>

                  {msg.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.options.map((opt) => (
                        <motion.button
                          key={opt.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectOption(opt.value)}
                          /* hover:border-blue-500 -> hover:border-emerald-500, hover:bg-blue-50 -> hover:bg-emerald-50 */
                          className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-sm group"
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <div>
                            {/* group-hover:text-blue-600 -> group-hover:text-emerald-600 */}
                            <div className="font-bold text-gray-900 text-xs group-hover:text-emerald-600">{opt.label}</div>
                            <div className="text-[10px] text-gray-400">{opt.value}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/80 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative">
          {/* focus:ring-blue-500/20 -> focus:ring-emerald-500/20, focus:border-blue-500 -> focus:border-emerald-500 */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="w-full pl-6 pr-24 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* hover:text-blue-500 -> hover:text-emerald-500 */}
            <button 
              type="button"
              className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
            >
              <Mic size={20} />
            </button>
            {/* bg-blue-600 -> bg-emerald-600, shadow-blue-200 -> shadow-emerald-200, hover:bg-blue-700 -> hover:bg-emerald-700 */}
            <button 
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <p className="mt-3 text-center text-[10px] text-gray-400">
          예: 어제 싸운 여자친구와 화해할 수 있는 데이트
        </p>
      </div>
    </div>
  );
}
