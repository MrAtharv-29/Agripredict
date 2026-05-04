import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { translations } from '../translations';
import { MessageSquare, Send, Bot, X, Maximize2, Minimize2, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatbot() {
  const { predictionResult, language } = useStore();
  const t = translations[language];

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AgriPulse AI Assistant. Ask me anything about your farm, weather, or yield forecasts.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Contextual triggers based on prediction
  useEffect(() => {
    if (predictionResult && predictionResult.risk_level === 'High' && messages.length === 1) {
      setTimeout(() => {
        setIsOpen(true);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `I noticed your last forecast had a HIGH risk level. Your yield is projected at ${predictionResult.yield_prediction} t/ha. Based on the model, I highly recommend increasing your irrigation schedule next week. Want me to simulate that?` 
        }]);
      }, 3000);
    }
  }, [predictionResult]);
  
  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Mock AI response logic
    setTimeout(() => {
      let aiResponse = "That's an interesting question. Based on current agricultural models, maintaining balanced soil pH and nitrogen levels is key.";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('rainfall') || lowerInput.includes('water')) {
        aiResponse = "If rainfall drops next week, you should compensate with an extra 15mm of irrigation. The model shows your current soil moisture is dropping quickly, which could decrease yield by up to 12%.";
      } else if (lowerInput.includes('nitrogen') || lowerInput.includes('fertilizer')) {
        aiResponse = "Your nitrogen levels are decent, but adding a top dressing now could boost your yield by another 5-8% according to the latest simulation.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = "Hi there! How can I help optimize your farm today?";
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
      speak(aiResponse);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all z-50"
      >
        <MessageSquare size={24} className="fill-current" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 right-6 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 ${
              isExpanded ? 'w-[800px] h-[80vh] max-w-[90vw]' : 'w-[380px] h-[550px]'
            }`}
          >
            {/* Header */}
            <div className="bg-zinc-800 p-4 border-b border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Bot size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">AgriPulse Assistant</h3>
                  <p className="text-[10px] text-emerald-400 font-medium">Online • Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-zinc-400 hover:text-zinc-100 p-1">
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-100 p-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-zinc-700 bg-zinc-800/50">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 focus-within:border-emerald-500 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for advice..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
                />
                <button
                  onClick={toggleListening}
                  className={`p-1.5 rounded-full transition-colors ${isListening ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {isListening ? <Mic size={18} /> : <Mic size={18} />}
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
