import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Place, Course, UserPreferences } from './types';
import { getNextResponse, MOCK_PLACES } from './services/gemini';
import Chat from './components/Chat';
import Map from './components/Map';
import CourseTimeline from './components/CourseTimeline';
import { Map as MapIcon, Calendar, Sparkles, ChevronRight, Menu, User } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '오늘 성수동에서 뭐 하고 싶으세요?',
      options: [
        { label: '지금 핫한 팝업 코스', value: 'hot_popup', icon: '🔥' },
        { label: '조용한 소개팅 필수 코스', value: 'blind_date', icon: '🤝' },
        { label: '에너지 넘치는 액티비티 코스', value: 'activity', icon: '🏃' },
        { label: '비 오는 날 실내 코스', value: 'rainy_day', icon: '🌧️' },
      ]
    }
  ]);
  const [currentCourse, setCurrentCourse] = useState<Place[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0); // 0: Mood, 1: Popup, 2: Food, 3: Cafe, 4: Complete
  const [view, setView] = useState<'chat' | 'course'>('chat');

  const handleSendMessage = async (content: string) => {
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    
    setIsTyping(true);
    try {
      const aiResponse = await getNextResponse(updatedMessages);
      
      const nextMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse.text,
        options: aiResponse.options,
        type: aiResponse.isComplete ? 'course_preview' : 'selection'
      };

      // If the user selected an option with metadata, add it to the course
      const lastUserMsg = newUserMsg.content;
      const previousAssistantMsg = messages[messages.length - 1];
      const selectedOption = previousAssistantMsg?.options?.find(o => o.label === lastUserMsg);
      
      if (selectedOption?.metadata) {
        const newPlace: Place = {
          id: Date.now().toString(),
          name: selectedOption.metadata.name,
          type: 'popup', // Simplified for now
          description: selectedOption.metadata.description,
          time: selectedOption.metadata.time,
          lat: selectedOption.metadata.lat,
          lng: selectedOption.metadata.lng
        };
        setCurrentCourse(prev => [...prev, newPlace]);
      }

      setMessages(prev => [...prev, nextMsg]);
      if (aiResponse.isComplete) {
        setView('course');
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectOption = (value: string) => {
    const option = messages[messages.length - 1].options?.find(o => o.value === value);
    if (option) {
      handleSendMessage(option.label);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F0F2F5] text-gray-900 font-sans selection:bg-blue-100 flex flex-col">
      {/* Navigation Rail / Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-blue-600">PYNSET</h1>
            <p className="text-[10px] text-gray-400 font-medium">성수동 실패 제로 데이트 큐레이션</p>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setView('chat')}
              className={`text-sm font-bold transition-colors ${view === 'chat' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              [내 코스함]
            </button>
            <button className="text-sm font-bold text-gray-400 hover:text-gray-600">[성수 핫플]</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 md:hidden">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={14} />
            </div>
            <span className="text-xs font-bold text-gray-600">jmc2005</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map & Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full overflow-hidden">
          <div className="flex-1 min-h-0">
            <Map places={currentCourse} activeStep={currentCourse.length - 1} />
          </div>
          
          <div className="h-1/3 min-h-[150px] overflow-y-auto pr-2 shrink-0">
            <AnimatePresence>
              {currentCourse.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <CourseTimeline 
                    places={currentCourse} 
                    onReorder={setCurrentCourse}
                    onRemove={(id) => setCurrentCourse(prev => prev.filter(p => p.id !== id))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          <Chat 
            messages={messages} 
            onSendMessage={handleSendMessage}
            onSelectOption={handleSelectOption}
            isTyping={isTyping}
          />
        </div>
      </main>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl border border-white/20 md:hidden">
        <button 
          onClick={() => setView('chat')}
          className={`flex items-center gap-2 text-sm font-bold ${view === 'chat' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Sparkles size={18} />
          채팅
        </button>
        <div className="w-px h-4 bg-gray-200 mx-2" />
        <button 
          onClick={() => setView('course')}
          className={`flex items-center gap-2 text-sm font-bold ${view === 'course' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <MapIcon size={18} />
          지도
        </button>
      </div>
    </div>
  );
}
