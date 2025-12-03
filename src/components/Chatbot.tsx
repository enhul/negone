import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { useMember } from '@/integrations';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

async function getGroqResponse(userMessage: string, conversationId: string): Promise<{ message: string; conversationId: string }> {
  try {
    // Call the backend API route to use GROQ AI
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        conversationId: conversationId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Chat API error:', error);
      
      if (response.status === 401) {
        return { 
          message: 'Уучлаарай, API түлхүүр олдсонгүй. Админтай холбогдоорой.',
          conversationId: conversationId,
        };
      }
      
      if (response.status === 429) {
        return { 
          message: 'Уучлаарай, хэтэрхий олон асуулт ирлээ. Хэсэг хугацаа хүлээнэ үү.',
          conversationId: conversationId,
        };
      }
      
      return { 
        message: 'Уучлаарай, хариулт авахад алдаа гарлаа. Дахин оролдоорой.',
        conversationId: conversationId,
      };
    }

    const data = await response.json();
    return {
      message: data.message || 'Хариулт авахад алдаа гарлаа.',
      conversationId: data.conversationId || conversationId,
    };
  } catch (error) {
    console.error('Error calling chat API:', error);
    return { 
      message: 'Уучлаарай, сүлжээний алдаа гарлаа. Дахин оролдоорой.',
      conversationId: conversationId,
    };
  }
}

export default function Chatbot() {
  const { isAuthenticated } = useMember();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId] = useState(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Сайн байна уу! Би NegOne AI туслах юм. Та эрүүл мэнд, фитнес, хооллолт, сэтгэлзүйн талаар асуулт байвал асууж болно.',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Get response from GROQ AI
    const { message: botResponseText } = await getGroqResponse(userMessageText, conversationId);
    
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="bg-white/95 backdrop-blur-sm border-primary/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-primary/10">
                <h3 className="font-heading text-lg text-foreground">NegOne AI Туслах</h3>
                <p className="text-sm text-foreground/70 font-paragraph">Эрүүл мэндийн асуулт асууж болно</p>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl font-paragraph text-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-gray-100 text-foreground rounded-bl-none'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 text-foreground px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Хариулт бичиж байна...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-primary/10 p-4 bg-white/50">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Асуулт асууж болно..."
                    className="rounded-full border-primary/20 focus:border-primary font-paragraph text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
