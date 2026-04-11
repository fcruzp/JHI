'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const { language, chatOpen, setChatOpen } = useAppStore();
  const t = getTranslation(language);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (chatOpen && !initialized) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t.chatWelcome,
        },
      ]);
      setInitialized(true);
    }
  }, [chatOpen, initialized, t.chatWelcome]);

  // Reset when language changes
  useEffect(() => {
    setInitialized(false);
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          language,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I apologize, but I could not process your request. Please try again.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting. Please try again or contact us directly.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (!voiceMode) {
      // Activating voice mode
      startListening();
    } else {
      // Deactivating voice mode
      stopListening();
    }
  };

  // ============================================================
  // ELEVENLABS VOICE INTEGRATION PLACEHOLDER
  // ============================================================
  // To integrate ElevenLabs real-time voice:
  //
  // 1. Install: npm install @elevenlabs/elevenlabs-js
  //
  // 2. Add environment variable: ELEVENLABS_API_KEY=your_key
  //
  // 3. Replace startListening/stopListening with:
  //
  // const startListening = async () => {
  //   setIsListening(true);
  //   try {
  //     // Use Web Speech API for speech-to-text
  //     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  //     recognition.lang = language === 'es' ? 'es-ES' : language === 'zh' ? 'zh-CN' : 'en-US';
  //     recognition.continuous = false;
  //     recognition.interimResults = false;
  //
  //     recognition.onresult = async (event) => {
  //       const transcript = event.results[0][0].transcript;
  //       setInput(transcript);
  //       setIsListening(false);
  //       // Auto-send after voice input
  //       await sendMessageWithText(transcript);
  //     };
  //
  //     recognition.onerror = () => setIsListening(false);
  //     recognition.onend = () => setIsListening(false);
  //     recognition.start();
  //   } catch (error) {
  //     console.error('Voice recognition error:', error);
  //     setIsListening(false);
  //   }
  // };
  //
  // 4. For TTS responses via ElevenLabs API route:
  //
  // // In /api/chat/route.ts, add ElevenLabs TTS:
  // // import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
  // // const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  // // const audio = await elevenlabs.textToSpeech.convert({
  // //   voice_id: 'your_voice_id',
  // //   text: response.content,
  // //   model_id: 'eleven_multilingual_v2',
  // // });
  // // Return audio stream alongside text response
  //
  // ============================================================

  const startListening = () => {
    setIsListening(true);
    // Placeholder: Use Web Speech API when available
    try {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'es' ? 'es-ES' : language === 'zh' ? 'zh-CN' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } else {
        // Fallback: no speech recognition available
        setTimeout(() => setIsListening(false), 2000);
      }
    } catch {
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] shadow-lg shadow-[#c9a84c]/20 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a84c]/30 animate-pulse-glow"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl border flex flex-col overflow-hidden bg-white dark:bg-[#111111] border-gray-200 dark:border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#c9a84c]/20 bg-gradient-to-r from-[#c9a84c]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {t.chatTitle}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setChatOpen(false)}
                className="rounded-full h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#c9a84c] text-[#0a0a0a] rounded-br-md'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c9a84c]/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#c9a84c]/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#c9a84c]/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice mode indicator */}
            {voiceMode && isListening && (
              <div className="px-4 py-2 bg-[#c9a84c]/10 border-t border-[#c9a84c]/20 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-[#c9a84c] font-medium">{t.chatListening || t.chatVoiceActive}</span>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-end gap-2">
                {/* Voice/Text toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceMode}
                  className={`rounded-full h-10 w-10 flex-shrink-0 ${
                    voiceMode
                      ? 'text-[#c9a84c] bg-[#c9a84c]/10'
                      : 'text-gray-400 hover:text-[#c9a84c]'
                  }`}
                  title={voiceMode ? t.chatTextMode || 'Text' : t.chatVoice}
                >
                  {voiceMode ? <Type className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={voiceMode ? (t.chatListening || t.chatVoiceActive) : t.chatPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-colors bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-white/10 border border-gray-100 dark:border-white/5 focus:border-[#c9a84c]/30"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="rounded-full h-10 w-10 flex-shrink-0 bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
