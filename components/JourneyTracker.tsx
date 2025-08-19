'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Milestone, TimerIcon as Timeline, Map, Star } from 'lucide-react'

interface JourneyTrackerProps childName: string
  birthdate: string
  currentAge: number

interface MilestoneType age: number
  title: string
  description: string
  completed: boolean

export default function JourneyTracker({ childName, birthdate, currentAge }: JourneyTrackerProps) const [milestones, setMilestones] = useState<MilestoneType[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => // Generate milestones based on birthdate and current age
    const generateMilestones = () => const birthYear = new Date(birthdate).getFullYear()
      const milestoneAges = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70]
      
      return milestoneAges.map(age => (age,
        title: `${age} Year Milestone`,
        description: getMilestoneDescription(age),
        completed: currentAge >= age))

    const newMilestones = generateMilestones()
    setMilestones(newMilestones)
    
    // Calculate progress
    const completedCount = newMilestones.filter(m => m.completed).length
    const totalCount = newMilestones.length
    setProgress(totalCount > 0 ? (completedCount / totalCount) * 100 : 0), [birthdate, currentAge])

  const getMilestoneDescription = (age: number) => const descriptions: {[key: number]: string} = 7: "First major planetary cycle complete. Developing sense of self and independence.",
      14: "Second cycle milestone. Adolescence brings emotional and identity development.",
      21: "Third cycle milestone. Entering adulthood with new responsibilities and choices.",
      28: "Fourth cycle milestone. Establishing life path and personal values.",
      35: "Fifth cycle milestone. Mid-life adjustments and deeper purpose emerging.",
      42: "Sixth cycle milestone. Wisdom and experience begin to crystallize.",
      49: "Seventh cycle milestone. Spiritual growth and life review period.",
      56: "Eighth cycle milestone. Legacy building and mentorship phase.",
      63: "Ninth cycle milestone. Wisdom sharing and elder status emerging.",
      70: "Tenth cycle milestone. Full circle of life experience and spiritual mastery."
    
    return descriptions[age] || `Age ${age} milestone in life's journey.`

  const getNextMilestone = () => const next = milestones.find(m => !m.completed)
    if (!next) return null
    
    const birthDate = new Date(birthdate)
    const milestoneDate = new Date(birthDate)
    milestoneDate.setFullYear(birthDate.getFullYear() + next.age)
    
    return (...next,
      date: milestoneDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const nextMilestone = getNextMilestone()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {childName}'s Journey Tracker
        </h2>
        <p className="text-gray-600">
          Tracking cosmic milestones through life's journey
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-purple-500" />
            Journey Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Journey Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Milestone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Next Milestone: {nextMilestone.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{nextMilestone.description}</p>
                    <p className="text-xs text-purple-600 mt-2">Expected on {nextMilestone.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Milestones Timeline */}
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2 mb-3">
              <Timeline className="h-4 w-4 text-purple-500" />
              Life Milestones
            </h4>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`rounded-full p-1 ${milestone.completed ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <Star className={`h-3 w-3 ${milestone.completed ? 'text-purple-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {milestone.title}
                      </h5>
                      <Badge variant={milestone.completed ? "default" : "outline"} className={milestone.completed ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}>
                        Age {milestone.age}
                      </Badge>
                    </div>
                    <p className={`text-xs mt-1 ${milestone.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
