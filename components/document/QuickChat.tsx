'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickChatProps {
  documentId: Id<'documents'>;
  suggestedQuestions?: string[];
}

export function QuickChat({ documentId, suggestedQuestions }: QuickChatProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.chat.getHistory, { documentId });
  const chatWithDocument = useAction(api.ai.chat.chatWithDocument);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || message.trim();
    if (!messageToSend || sending) return;

    setSending(true);
    setMessage('');

    try {
      await chatWithDocument({
        documentId,
        userMessage: messageToSend,
      });
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayedMessages = messages?.slice(-6) || [];
  const hasMessages = displayedMessages.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-[#009de0]/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="font-semibold text-slate-900">Ask Questions</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">Chat with your document</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-[#009de0]/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <p className="text-slate-600 mb-4">Ask anything about this document</p>

            {/* Suggested Questions */}
            {suggestedQuestions && suggestedQuestions.length > 0 && (
              <div className="space-y-2 w-full">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Suggested</p>
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question)}
                    disabled={sending}
                    className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 border border-slate-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {displayedMessages.map((msg: any) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#009de0] to-[#00d4ff] text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.pageReferences && msg.pageReferences.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-300">
                        <p className="text-xs opacity-75">
                          Referenced: Page{msg.pageReferences.length > 1 ? 's' : ''}{' '}
                          {msg.pageReferences.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-200 px-4 py-3 rounded-2xl">
                  <Loader2 className="w-5 h-5 text-[#00d4ff] animate-spin" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={sending}
            className="flex-1 px-4 py-3 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009de0] focus:border-transparent text-slate-900 placeholder-slate-400 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={sending || !message.trim()}
            className="px-4 py-3 bg-gradient-to-r from-[#009de0] to-[#00d4ff] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
