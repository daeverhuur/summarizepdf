'use client';

import { use, useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Send, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const document = useQuery(api.documents.get, { documentId: id as Id<'documents'> });
  const messages = useQuery(api.chat.getHistory, { documentId: id as Id<'documents'> });
  const chatWithDocument = useAction(api.ai.chat.chatWithDocument);

  if (document === undefined) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    notFound();
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await chatWithDocument({
        documentId: id as Id<'documents'>,
        userMessage: message.trim(),
      });
      setMessage('');
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Chat with {document.title}</h1>
        <p className="text-slate-600">Ask questions about your document</p>
      </div>

      <Card className="p-6">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto mb-6 space-y-4">
          {messages && messages.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages.map((msg: any) => (
              <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-600">Start a conversation about this document</p>
              <p className="text-sm text-slate-500 mt-2">
                Try asking: &quot;What are the main points?&quot; or &quot;Summarize page 5&quot;
              </p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !message.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
