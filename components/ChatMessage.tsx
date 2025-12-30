
import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;
  const isReport = message.isReport;

  if (isReport) {
    return (
      <div className="flex flex-col items-center my-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-xl p-6 w-full max-w-2xl transform transition-transform hover:scale-[1.01]">
          <div className="flex items-center gap-2 mb-4 text-blue-600 border-b pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold font-tajawal">التقرير الطبي التقديري</h3>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-wrap font-tajawal">
            {message.content}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 italic text-center">
            هذا التقرير تم توليده بواسطة ذكاء اصطناعي ولا يمثل تشخيصاً طبياً معتمداً.
          </div>
        </div>
      </div>
    );
  }

  // In RTL: justify-start is right, justify-end is left.
  // Standard chat: User on the right (start), Model on the left (end).
  return (
    <div 
      className={`flex w-full mb-4 ${isModel ? 'justify-end' : 'justify-start'} 
      animate-in fade-in duration-500 ease-out fill-mode-both
      ${isModel ? 'slide-in-from-left-4' : 'slide-in-from-right-4'}`}
    >
      <div 
        className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm transition-all
          ${isModel 
            ? 'bg-blue-50 text-blue-900 rounded-tl-none border border-blue-100' 
            : 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100'
          }`}
      >
        <p className="text-sm md:text-base leading-relaxed font-tajawal">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
