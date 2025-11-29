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

const HEALTH_RESPONSES = {
  fitness: [
    "Фитнесийн хувьд сайн сонголт! Өдөр бүр 30 минут нэвтрүүлэх дасгал хийх нь сайн байдаг. Та ямар төрлийн дасгал сонирхож байна вэ?",
    "Дасгал хийх нь таны эрүүл мэндийн үндэс юм. Сарын 150 минут дунд зэргийн дасгал эсвэл 75 минут эрчимтэй дасгал хийхийг зөвлөж байна.",
    "Фитнесийн зорилгодоо хүрэхийн тулд тогтмол байх нь чухал юм. Өдөр бүр ижил цагт дасгал хийх нь сайн дассан юм."
  ],
  nutrition: [
    "Эрүүл хооллолт нь эрүүл мэндийн 80% юм! Өдөр бүр 5 төрлийн ногоо, жимс идэх нь сайн байдаг.",
    "Усны хэрэглээ маш чухал юм. Өдөр бүр 2-3 литр ус ууж байх нь зөвлөмжтэй байдаг.",
    "Протеин, нүүрс, өөхөн гэсэн гурван үндсэн хүнсний бүрэлдэхүүн байдаг. Тэнцвэртэй хооллолт нь чухал юм."
  ],
  mental: [
    "Сэтгэлзүйн эрүүл мэнд нь физик эрүүл мэндтэй адил чухал юм. Өдөр бүр 10 минут медитаци хийх нь сайн байдаг.",
    "Стресс бага болгохын тулд гүнзгий амьсгал хийх, йога хийх эсвэл байгальд явах нь сайн байдаг.",
    "Өөрийгөө хайрлах нь эхлэл юм. Өдөр бүр өөртөө сайн үг хэлэх нь сэтгэлзүйн эрүүл мэндэд тусалдаг."
  ],
  general: [
    "Сайн асуулт! NegOne платформ нь таны эрүүл мэнд, сэтгэлзүй, өөрийгөө хайрлахад туслах зорилготой байдаг.",
    "Та ямар сэдвээр асуулт байна вэ? Фитнес, хооллолт, сэтгэлзүй эсвэл өөр зүйл?",
    "Таны эрүүл мэндийн аялалд бид хамтдаа явахад сайн сонирхож байна!"
  ]
};

function getRelevantResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('дасгал') || lowerMessage.includes('фитнес') || lowerMessage.includes('спорт') || lowerMessage.includes('биеийн')) {
    return HEALTH_RESPONSES.fitness[Math.floor(Math.random() * HEALTH_RESPONSES.fitness.length)];
  }
  
  if (lowerMessage.includes('хоол') || lowerMessage.includes('хүнс') || lowerMessage.includes('ус') || lowerMessage.includes('калори') || lowerMessage.includes('жор')) {
    return HEALTH_RESPONSES.nutrition[Math.floor(Math.random() * HEALTH_RESPONSES.nutrition.length)];
  }
  
  if (lowerMessage.includes('сэтгэл') || lowerMessage.includes('стресс') || lowerMessage.includes('сэтгэлзүй') || lowerMessage.includes('сэтгэлийн')) {
    return HEALTH_RESPONSES.mental[Math.floor(Math.random() * HEALTH_RESPONSES.mental.length)];
  }
  
  return HEALTH_RESPONSES.general[Math.floor(Math.random() * HEALTH_RESPONSES.general.length)];
}

export default function Chatbot() {
  const { isAuthenticated } = useMember();
  const [isOpen, setIsOpen] = useState(false);
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

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRelevantResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
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
