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
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emotionalIntent, setEmotionalIntent] = useState('curious')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const generateAIResponse = (userMessage: string, intent: string) => {
    const currentPlanetaryCard = planetaryPeriods.find((p) => {
      const today = new Date()
      const startDate = new Date(p.startDate)
      const endDate = new Date(p.endDate)
      return today >= startDate && today <= endDate
    })

    const responses: Record<string, string[]> = {
      concerned: [
        `I understand your concern about ${childName}. As a ${birthCard} child at age ${currentAge}, they're naturally navigating some complex energies right now. The ${
          yearlyForecast?.longRange || 'current'
        } influence in their yearly spread suggests this is actually a time of important growth. What specific behavior or situation has you worried? I'm here to help you understand it through their cosmic blueprint.`,
        `Your loving concern for ${childName} shows what a thoughtful parent you are. Children with the ${birthCard} birth card often experience ${
          currentAge < 10
            ? 'intense emotional waves'
            : currentAge < 15
            ? 'identity exploration phases'
            : 'independence-seeking behaviors'
        } around this age. The ${
          currentPlanetaryCard?.planet || 'current planetary'
        } period they're in right now (${
          currentPlanetaryCard?.card || 'their current influence'
        }) can amplify these tendencies. Let's explore what support they need most.`,
      ],
      curious: [
        `What a wonderful question about ${childName}! Their ${birthCard} birth card reveals such fascinating layers. At age ${currentAge}, they're in their ${
          yearlyForecast?.longRange || 'Long Range'
        } year, which brings themes of ${
          yearlyForecast?.longRange?.includes('♥')
            ? 'emotional growth and relationships'
            : yearlyForecast?.longRange?.includes('♣')
            ? 'learning and communication'
            : yearlyForecast?.longRange?.includes('♦')
            ? 'practical skills and values'
            : 'action and new experiences'
        }. Right now, they're also under the ${
          currentPlanetaryCard?.planet || 'current'
        } planetary influence (${
          currentPlanetaryCard?.card || 'their current card'
        }), which adds another beautiful dimension to their personality.`,
        `I love your curiosity about ${childName}'s inner world! The ${birthCard} energy is so special - these children often ${
          birthCard.includes('♥')
            ? 'lead with their emotions and have deep empathy'
            : birthCard.includes('♣')
            ? 'are natural communicators and love learning'
            : birthCard.includes('♦')
            ? 'have strong values and practical wisdom'
            : 'are action-oriented and pioneering spirits'
        }. At ${currentAge}, this manifests as... What specific aspect of their personality are you most curious about?`,
      ],
      celebrating: [
        `How wonderful that you're celebrating ${childName}! Their ${birthCard} energy is truly shining through. At age ${currentAge}, they're in such a beautiful phase of development. The ${
          yearlyForecast?.result || 'Result'
        } card in their yearly spread (${
          yearlyForecast?.result || 'their current result card'
        }) suggests this is indeed a time for recognition and joy. Their ${
          currentPlanetaryCard?.planet || 'current planetary'
        } period is supporting this growth beautifully.`,
        `Your joy about ${childName}'s growth fills my heart! As a ${birthCard} child, they're naturally gifted in ways that are becoming more visible at age ${currentAge}. The cosmic influences this year - especially their ${
          yearlyForecast?.support || 'Support'
        } card (${
          yearlyForecast?.support || 'their support card'
        }) - are creating perfect conditions for them to flourish. What specific achievement or growth are you celebrating?`,
      ],
      supportive: [
        `Your supportive energy for ${childName} is exactly what they need right now. As a ${birthCard} child at age ${currentAge}, they're learning to balance their natural gifts with the world around them. The ${
          yearlyForecast?.development || 'Development'
        } card in their spread (${
          yearlyForecast?.development || 'their development card'
        }) shows where they're growing, and your loving support is helping them integrate these new aspects of themselves.`,
        `What a gift you are to ${childName}! Your understanding approach is perfect for a ${birthCard} child. At this age (${currentAge}), they're working with the ${
          yearlyForecast?.pluto || 'Pluto'
        } influence (${
          yearlyForecast?.pluto || 'their transformation card'
        }), which can bring deep changes. Your supportive presence helps them navigate these shifts with confidence and grace.`,
      ],
    }

    const intentResponses =
      responses[intent as keyof typeof responses] || responses.curious
    return intentResponses[Math.floor(Math.random() * intentResponses.length)]
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

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage, emotionalIntent),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Cardology Guidance Chat
        </CardTitle>
        <p className="text-center text-gray-600">
          Ask questions about {childName}'s personality, needs, and growth
          path
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
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
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${childName}'s cosmic blueprint...`}
            disabled={isLoading}
            className="flex-1 border-purple-200 focus:border-purple-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}