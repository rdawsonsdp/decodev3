import activitiesData from '../public/card-data/activities.json'

interface CardProfile {
  name: string
  description: string
}

export function getCardProfile(card: string): CardProfile {
  const activity = activitiesData[card as keyof typeof activitiesData] || ''
  
  // Extract name from activity if it has the format "Card Name: Description"
  const parts = activity.split(':')
  const name = parts.length > 1 ? parts[0].trim() : `${card} Card`
  const description = parts.length > 1 ? parts.slice(1).join(':').trim() : activity || `This card represents unique qualities and life lessons for your child.`
  
  return {
    name,
    description
  }
}