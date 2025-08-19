'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, HelpCircle, Smile, AlertCircle } from 'lucide-react'

interface EmotionalIntentFilterProps currentIntent: string
  onIntentChange: (intent: string) => void

const intents = [
  { id: 'curious', label: 'Curious', icon: HelpCircle, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { id: 'concerned', label: 'Concerned', icon: AlertCircle, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { id: 'celebrating', label: 'Celebrating', icon: Smile, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { id: 'supportive', label: 'Supportive', icon: Heart, color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' }
]

export default function EmotionalIntentFilter({ currentIntent, onIntentChange }: EmotionalIntentFilterProps) return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling about your child today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {intents.map((intent) => (
            <Button
              key={intent.id}
              variant={currentIntent === intent.id ? 'default' : 'outline'}
              onClick={() => onIntentChange(intent.id)}
              className={`flex flex-col items-center gap-2 h-auto py-4 $currentIntent === intent.id ? '' : intent.color`}
            >
              <intent.icon className="h-6 w-6" />
              <span className="text-sm">{intent.label}</span>
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-3 text-center">
          Your emotional state helps me provide more relevant guidance
        </p>
      </CardContent>
    </Card>
  )
