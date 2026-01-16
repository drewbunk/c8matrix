import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversation) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      const newConversation = await base44.agents.createConversation({
        agent_name: 'website_assistant',
        metadata: {
          name: 'Website Chat',
          source: 'website_widget'
        }
      });
      setConversation(newConversation);
      setMessages(newConversation.messages || []);
      
      // Subscribe to updates
      const unsubscribe = base44.agents.subscribeToConversation(
        newConversation.id,
        (data) => {
          setMessages(data.messages);
        }
      );
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversation || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: userMessage
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 left-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 text-white hover:from-red-700 hover:via-orange-600 hover:to-yellow-600 shadow-2xl border-2 border-white/20 relative overflow-hidden group"
              size="icon"
            >
              {/* Racing stripes effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
              
              {/* Checkered flag pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)`,
                backgroundSize: '8px 8px'
              }} />
              
              <MessageCircle size={28} className="relative z-10 drop-shadow-lg" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-[380px] h-[600px] bg-zinc-950 border-2 border-red-600/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 border-b border-red-700 p-4 flex items-center justify-between relative overflow-hidden">
              {/* Racing stripes background */}
              <div className="absolute inset-0 opacity-20" style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
              }} />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-700">
                  <span className="text-red-600 font-bold text-lg">🏁</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-shadow-lg">C8Matrix Pit Crew</h3>
                  <p className="text-white/90 text-xs font-medium">Ready to assist</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20 relative z-10"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/60 text-sm mb-4">
                    Hi! I'm here to help you learn about Drew's services and how to get in touch.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setInputMessage("What services do you offer?")}
                      className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
                    >
                      What services do you offer?
                    </button>
                    <button
                      onClick={() => setInputMessage("How can I contact you?")}
                      className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
                    >
                      How can I contact you?
                    </button>
                    <button
                      onClick={() => setInputMessage("Tell me about your projects")}
                      className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 text-sm transition-colors"
                    >
                      Tell me about your projects
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3">
                    <Loader2 size={16} className="text-white/60 animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gradient-to-br from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 border border-red-700"
                  disabled={isLoading || !inputMessage.trim()}
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}