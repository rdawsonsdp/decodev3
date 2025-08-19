'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Calendar } from 'lucide-react'

interface AgeCalculatorProps childName: string
  birthdate: string
  currentAge: number
  onAgeChange: (age: number) => void

export default function AgeCalculator({ childName, birthdate, currentAge, onAgeChange }: AgeCalculatorProps) const actualAge = Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))

  const handleAgeChange = (delta: number) => const newAge = Math.max(0, Math.min(100, currentAge + delta))
    onAgeChange(newAge)

  const resetToActualAge = () => onAgeChange(actualAge)

  const getAgeInsight = (age: number) => if (age < 2) return "Discovering the world through senses and basic trust"
    if (age < 5) return "Developing independence and exploring creativity"
    if (age < 12) return "Building skills, friendships, and understanding rules"
    if (age < 18) return "Forming identity and preparing for independence"
    if (age < 25) return "Establishing career and personal relationships"
    return "Continuing personal growth and life mastery"

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Age Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            {childName} is currently {actualAge} years old
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Adjust the age below to explore different life stages
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAgeChange(-1)}
            disabled={currentAge <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{currentAge}</div>
            <div className="text-sm text-gray-500">years old</div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAgeChange(1)}
            disabled={currentAge >= 100}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {currentAge !== actualAge && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToActualAge}
              className="text-blue-600 hover:text-blue-700"
            >
              Reset to current age ({actualAge})
            </Button>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Life Stage Insight (Age {currentAge})
          </h4>
          <p className="text-blue-800 text-sm">
            {getAgeInsight(currentAge)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
