import { getYearlyForecast } from './yearlyForecastLookup'

export function getPlanetaryPeriods(
  birthCard: string,
  age: number,
  birthdate: string
) {
  // Get the yearly forecast data which contains the planetary cards
  const forecast = getYearlyForecast(birthCard, age)
  
  // Parse birthdate to calculate period start dates
  const [year, month, day] = birthdate.split('-').map(Number)
  const ageYear = new Date().getFullYear()
  
  // Calculate the birthday this year (age year start)
  const ageYearStart = new Date(ageYear, month - 1, day)
  
  // Define the 7 planetary periods with their cards and dates
  const periods = [
    {
      planet: 'Mercury',
      card: forecast.mercury,
      startDate: new Date(ageYearStart.getTime()),
      duration: 52,
    },
    {
      planet: 'Venus', 
      card: forecast.venus,
      startDate: new Date(ageYearStart.getTime() + 52 * 24 * 60 * 60 * 1000),
      duration: 52,
    },
    {
      planet: 'Mars',
      card: forecast.mars,
      startDate: new Date(ageYearStart.getTime() + 104 * 24 * 60 * 60 * 1000),
      duration: 52,
    },
    {
      planet: 'Jupiter',
      card: forecast.jupiter,
      startDate: new Date(ageYearStart.getTime() + 156 * 24 * 60 * 60 * 1000),
      duration: 52,
    },
    {
      planet: 'Saturn',
      card: forecast.saturn,
      startDate: new Date(ageYearStart.getTime() + 208 * 24 * 60 * 60 * 1000),
      duration: 52,
    },
    {
      planet: 'Uranus',
      card: forecast.uranus,
      startDate: new Date(ageYearStart.getTime() + 260 * 24 * 60 * 60 * 1000),
      duration: 52,
    },
    {
      planet: 'Neptune',
      card: forecast.neptune,
      startDate: new Date(ageYearStart.getTime() + 312 * 24 * 60 * 60 * 1000),
      duration: 53,
    },
  ]

  // Add end dates and current status
  const today = new Date()
  return periods.map((period) => {
    const endDate = new Date(period.startDate.getTime() + period.duration * 24 * 60 * 60 * 1000)
    const isCurrent = today >= period.startDate && today < endDate
    
    return {
      planet: period.planet,
      card: period.card,
      startDate: period.startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      isCurrent,
      dateRange: `${period.startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    }
  })
}