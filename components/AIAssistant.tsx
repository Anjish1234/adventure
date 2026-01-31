import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, XIcon, PaperAirplaneIcon, SparklesIcon, PhotographIcon } from './Icons';
import { askAI, generateImage } from '../services/geminiService';
import { Geolocation, ImageSize } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  sender: 'user' | 'ai';
  text?: string;
  imageUrl?: string;
  isLoading?: boolean;
}

interface AIAssistantProps {
    userLocation: Geolocation | null;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ userLocation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.ONE_K);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ sender: 'ai', text: 'Hello! I am your Adventurly AI assistant. How can I help you plan your next adventure? You can ask me for tips, or switch to image mode to visualize a scene!' }]);
    } else {
        setMessages([]);
        setInput('');
        setMode('chat');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input } as Message;
    setMessages(prev => [...prev, userMessage, { sender: 'ai', isLoading: true }]);
    const currentInput = input;
    setInput('');

    try {
        if(mode === 'chat') {
            const history = messages
                .filter(m => m.text)
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text! }]
                }));
            
            let prompt = currentInput;
            if (userLocation) {
                prompt = `${currentInput} (For context, my current location is approximately lat: ${userLocation.latitude}, long: ${userLocation.longitude})`;
            }

            const responseText = await askAI(prompt, history);
            setMessages(prev => prev.slice(0, -1).concat({ sender: 'ai', text: responseText }));
        } else { // image mode
            const imageUrl = await generateImage(currentInput, imageSize);
            setMessages(prev => prev.slice(0, -1).concat({ sender: 'ai', imageUrl: imageUrl }));
        }
    } catch (err) {
      console.error(err);
      const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev => prev.slice(0, -1).concat({ sender: 'ai', text: errorMessage }));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-30"
        aria-label="Open AI Assistant"
      >
        <SparklesIcon className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-2xl shadow-2xl flex flex-col z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-bold flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-cyan-400" /> AI Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mode Toggle */}
          <div className="p-2 bg-gray-900/50 flex">
              <button onClick={() => setMode('chat')} className={`flex-1 p-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${mode === 'chat' ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}`}>
                  <ChatIcon className="w-5 h-5 mr-2" /> Chat
              </button>
              <button onClick={() => setMode('image')} className={`flex-1 p-2 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${mode === 'image' ? 'bg-purple-500 text-white' : 'hover:bg-gray-700'}`}>
                  <PhotographIcon className="w-5 h-5 mr-2" /> Generate Image
              </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && <SparklesIcon className="h-6 w-6 text-cyan-400 flex-shrink-0" />}
                  <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                    {msg.isLoading ? <LoadingSpinner /> : null}
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    {msg.imageUrl && <img src={msg.imageUrl} alt="Generated by AI" className="rounded-lg mt-2" />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-gray-700">
            {mode === 'image' && (
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-gray-400">Image Size:</span>
                    {Object.values(ImageSize).map(s => (
                        <button key={s} onClick={() => setImageSize(s)} className={`px-2 py-1 text-xs rounded-md ${imageSize === s ? 'bg-purple-600 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'chat' ? "Ask anything..." : "Describe an image..."}
                className="flex-1 bg-gray-700 rounded-full py-2 px-4 text-sm focus:ring-cyan-500 focus:border-cyan-500 border-transparent"
              />
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full">
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;