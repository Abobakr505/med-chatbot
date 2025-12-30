
import React, { useState, useRef, useEffect } from 'react';
import { Role, Message } from './types';
import { MedicalChatService } from './services/geminiService';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      content: "أهلاً بك. أنا مساعدك الصحي الذكي، وأنا هنا لأستمع إليك وأساعدك في فهم ما تشعر به. سلامتك هي أولويتنا. من فضلك، ما هي المشكلة الصحية أو الأعراض التي تشغل بالك حالياً؟"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatServiceRef = useRef<MedicalChatService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatServiceRef.current = new MedicalChatService();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: Role.USER, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatServiceRef.current?.sendMessage(input) || "";
      
      const isReport = responseText.includes("---التقرير الطبي التقديري---");
      const cleanedText = responseText.replace("---التقرير الطبي التقديري---", "").trim();

      const modelMessage: Message = {
        role: Role.MODEL,
        content: cleanedText,
        isReport
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: Role.MODEL, 
        content: "أعتذر منك، حدث خطأ تقني غير متوقع. يهمنا أن تكون بخير، يرجى المحاولة مرة أخرى." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 font-tajawal">طبيبي الذكي</h1>
            <p className="text-xs text-green-500 flex items-center gap-1 font-medium font-tajawal">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              نحن معك الآن
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          title="بدء محادثة جديدة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </header>

      {/* Warning Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-[10px] md:text-xs text-blue-800 text-center font-medium font-tajawal">
        تنبيه: هذا المساعد للتوعية والإرشاد فقط. في حالات الطوارئ الحادة، يرجى التوجه لأقرب مستشفى فوراً.
      </div>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll bg-slate-50/50"
      >
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-end items-center gap-2 text-gray-400 animate-pulse">
            <div className="bg-blue-50 px-4 py-3 rounded-2xl rounded-tl-none border border-blue-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
        <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="تحدث معي عما تشعر به..."
            className="w-full resize-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700 min-h-[56px] max-h-32 font-tajawal"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute left-2 p-2 rounded-xl transition-all ${
              !input.trim() || isLoading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3 font-tajawal">
          نحن هنا لخدمتك • مدعوم بتقنيات الذكاء الاصطناعي المتقدمة
        </p>
      </footer>
    </div>
  );
};

export default App;
