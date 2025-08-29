import yearlyForecastsData from '../src/data/yearlyForecasts.json'

export function getYearlyForecast(birthCard: string, age: number) {
  try {
    // Get the data for this birth card
    const cardData = yearlyForecastsData[birthCard as keyof typeof yearlyForecastsData]
    
    if (!cardData) {
      console.error(`No forecast data found for birth card: ${birthCard}`)
      return {
        mercury: '?', venus: '?', mars: '?', jupiter: '?', 
        saturn: '?', uranus: '?', neptune: '?',
        longRange: '?', pluto: '?', result: '?', 
        support: '?', development: '?'
      }
    }
    
    // Find the data for this specific age
    const ageData = cardData.find((entry: any) => entry.age === age)
    
    if (!ageData) {
      console.error(`No forecast data found for age ${age}`)
      return {
        mercury: '?', venus: '?', mars: '?', jupiter: '?', 
        saturn: '?', uranus: '?', neptune: '?',
        longRange: '?', pluto: '?', result: '?', 
        support: '?', development: '?'
      }
    }
    
    return {
      mercury: ageData.mercury || '',
      venus: ageData.venus || '',
      mars: ageData.mars || '',
      jupiter: ageData.jupiter || '',
      saturn: ageData.saturn || '',
      uranus: ageData.uranus || '',
      neptune: ageData.neptune || '',
      longRange: ageData.longRange || '',
      pluto: ageData.pluto || '',
      result: ageData.result || '',
      support: ageData.support || '',
      development: ageData.development || ''
    }
    
  } catch (error) {
    console.error('Error reading yearly forecasts:', error)
    return {
      mercury: '?', venus: '?', mars: '?', jupiter: '?', 
      saturn: '?', uranus: '?', neptune: '?',
      longRange: '?', pluto: '?', result: '?', 
      support: '?', development: '?'
    }
  }
}