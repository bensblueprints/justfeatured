import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Loader2, ShoppingCart, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/useCart';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Publication {
  id: string;
  name: string;
  price: number;
  category: string;
  tier: string;
  website_url?: string;
}

export const PRChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedPublications, setRecommendedPublications] = useState<Publication[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addToCart, isInCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      const welcomeMessage: Message = {
        role: 'assistant',
        content: "I help brands get featured in major publications. Over 500 startups and SaaS companies have used our guaranteed press coverage to close funding rounds, land enterprise clients, and build instant credibility. Let me show you how.\n\nWhat type of business are you promoting?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Convert messages to OpenAI format
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await supabase.functions.invoke('pr-chatbot', {
        body: {
          message: currentMessage,
          conversationHistory
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send message');
      }

      const { message: botResponse, recommendedPublications: pubs } = response.data;

      // Simulate typing delay
      setTimeout(() => {
        const botMessage: Message = {
          role: 'assistant',
          content: botResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        
        if (pubs && pubs.length > 0) {
          setRecommendedPublications(pubs);
        }
        
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAddToCart = (publication: Publication) => {
    addToCart(publication.id);
    toast({
      title: "Added to Cart",
      description: `${publication.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const quickReplies = [
    "What's your pricing?",
    "I need local coverage",
    "I want national reach", 
    "I'm a SaaS startup",
    "What's included?"
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          data-chatbot-trigger
          className="bg-gradient-hero text-white hover:bg-gradient-hero/90 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 mr-2" />
          Get Featured in Press
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2">
        <CardHeader className="bg-gradient-hero text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">PR Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.role === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-lg max-w-[85%]">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Recommended Publications */}
          {recommendedPublications.length > 0 && (
            <div className="border-t p-4 bg-muted/30 max-h-48 overflow-y-auto">
              <h4 className="font-medium text-sm mb-3">Recommended Publications:</h4>
              <div className="space-y-2">
                {recommendedPublications.slice(0, 3).map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{pub.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{pub.category}</Badge>
                        <span className="font-semibold text-primary">{formatPrice(pub.price)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {pub.website_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(pub.website_url, '_blank', 'noopener,noreferrer')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(pub)}
                        disabled={isInCart(pub.id)}
                        className="h-8 px-2 text-xs"
                      >
                        {isInCart(pub.id) ? (
                          "In Cart"
                        ) : (
                          <ShoppingCart className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-4 border-t bg-muted/20">
              <div className="text-xs text-muted-foreground mb-2">Quick replies:</div>
              <div className="flex flex-wrap gap-1">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMessage(reply);
                      setTimeout(() => sendMessage(), 100);
                    }}
                    className="text-xs h-7 px-2"
                    disabled={isLoading}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !currentMessage.trim()}
                size="sm"
                className="bg-gradient-hero text-white hover:bg-gradient-hero/90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};