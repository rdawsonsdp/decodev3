'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Heart,
  Brain,
  Star,
  Sparkles,
  Edit,
  Trash2,
} from 'lucide-react'

interface GPTChatProps {
  childName: string
  birthCard: string
  currentAge: number
  yearlyForecast: any
  planetaryPeriods: any[]
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  emotionalIntent?: string
}

export default function GPTChat({
  childName,
  birthCard,
  currentAge,
  yearlyForecast,
  planetaryPeriods,
}: GPTChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi! I'm here to help you understand your child better`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emotionalIntent, setEmotionalIntent] = useState('curious');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [savedConversations, setSavedConversations] = useState<{ id: string, title: string, messages: Message[] }[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`conversations-${childName}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveConversation = (title: string) => {
    const newEntry = { id: Date.now().toString(), title, messages };
    const updated = [...savedConversations, newEntry];
    setSavedConversations(updated);
    localStorage.setItem(`conversations-${childName}`, JSON.stringify(updated));
    setCurrentConversationId(newEntry.id);
    
    // Add sparkle effect
    const saveButton = document.querySelector('[data-save-conversation]')
    if (saveButton) {
      saveButton.classList.add('sparkle-effect')
      setTimeout(() => saveButton.classList.remove('sparkle-effect'), 1000)
    }
  };

  const loadConversation = (convId: string) => {
    const convo = savedConversations.find(c => c.id === convId);
    if (convo) {
      setMessages(convo.messages);
      setCurrentConversationId(convo.id);
    }
  };

  const deleteConversation = (convId: string) => {
    const updated = savedConversations.filter(c => c.id !== convId);
    setSavedConversations(updated);
    localStorage.setItem(`conversations-${childName}`, JSON.stringify(updated));
    if (currentConversationId === convId) {
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: `Hi! I'm here to help you understand your child better`,
          timestamp: new Date(),
        },
      ]);
      setCurrentConversationId(null);
    }
  };

  const renameConversation = (convId: string, newTitle: string) => {
    const updated = savedConversations.map(c =>
      c.id === convId ? { ...c, title: newTitle } : c
    );
    setSavedConversations(updated);
    localStorage.setItem(`conversations-${childName}`, JSON.stringify(updated));
  };

  const getEmotionalIntentIcon = (intent: string) => {
    switch (intent) {
      case 'concerned':
        return <Heart className="w-4 h-4 text-red-500" />
      case 'curious':
        return <Brain className="w-4 h-4 text-blue-500" />
      case 'celebrating':
        return <Star className="w-4 h-4 text-yellow-500" />
      case 'supportive':
        return <Sparkles className="w-4 h-4 text-purple-500" />
      default:
        return <Brain className="w-4 h-4 text-blue-500" />
    }
  }

  const generateAIResponse = async (userMessage: string, intent: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          emotionalIntent: intent,
          childName,
          birthCard,
          currentAge,
          yearlyForecast,
          planetaryPeriods,
          conversationHistory: messages.map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Chat error:', error)
      return "I'm having trouble connecting right now. Please try again in a moment."
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      emotionalIntent,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Get AI response
    const aiResponse = await generateAIResponse(inputMessage, emotionalIntent)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Left Sidebar for Saved Conversations */}
      <div className="w-64 border-r bg-gray-50/50 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Saved Conversations</h3>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-2">
            {savedConversations.length === 0 && (
              <p className="text-sm text-gray-500">No conversations saved yet.</p>
            )}
            {savedConversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  currentConversationId === conv.id ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={() => loadConversation(conv.id)}
              >
                <span className="text-sm truncate">{conv.title}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTitle = prompt('Enter new title:', conv.title);
                      if (newTitle) renameConversation(conv.id, newTitle);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this conversation?')) {
                        deleteConversation(conv.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 shadow-lg border-0 bg-white/90 flex flex-col" style={{ zIndex: 1 }}>
        <CardHeader>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Cardology Guidance Chat
          </CardTitle>
          <p className="text-center text-gray-600">
            Ask questions about {childName}'s personality, needs, and growth
            path
          </p>
        </CardHeader>
        <CardContent className="space-y-2 flex-1 flex flex-col">
          {/* Emotional Intent Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <p className="text-sm text-gray-600 w-full text-center mb-2">
              How are you feeling about your question?
            </p>
            {[
              { value: 'curious', label: 'Curious', icon: Brain },
              { value: 'concerned', label: 'Concerned', icon: Heart },
              { value: 'celebrating', label: 'Celebrating', icon: Star },
              { value: 'supportive', label: 'Supportive', icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={emotionalIntent === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEmotionalIntent(value)}
                className={`flex items-center gap-1 ${
                  emotionalIntent === value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'hover:bg-purple-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            ))}
          </div>

          {/* Chat Messages */}
          <ScrollArea className="h-96 border rounded-lg p-4 bg-gray-50/50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white text-purple-600 shadow-md'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-white text-gray-800 border'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p
                          className={`text-xs ${
                            message.type === 'user'
                              ? 'text-purple-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        {message.emotionalIntent &&
                          message.type === 'user' && (
                            <Badge
                              variant="secondary"
                              className="text-xs flex items-center gap-1"
                            >
                              {getEmotionalIntentIcon(message.emotionalIntent)}
                              {message.emotionalIntent}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-white text-purple-600 shadow-md flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border p-3 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 border-purple-200 focus:border-purple-500"
            />
            <Button
              onClick={() => { handleSendMessage(); triggerHapticFeedback(); }}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 ripple-effect mobile-feedback"
            >
              <Send className="w-4 h-4" />
            </Button>
            <Button
              data-save-conversation
              onClick={() => { saveConversation(`Conversation ${new Date().toLocaleString()}`); triggerHapticFeedback(); }}
              disabled={isLoading || messages.length <= 1}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg ripple-effect mobile-feedback"
            >
              Save Conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
