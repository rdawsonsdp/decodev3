import birthdateLookup from '../src/data/birthdateLookup.json'

export function getBirthCardFromDate(birthdate: string): string {
  // Handle different date formats and avoid timezone issues
  let month: number
  let day: number
  
  if (birthdate.includes('-')) {
    // Handle YYYY-MM-DD format
    const parts = birthdate.split('-')
    month = parseInt(parts[1], 10)
    day = parseInt(parts[2], 10)
  } else {
    // Fallback to Date parsing for other formats
    const date = new Date(birthdate + ' 12:00:00') // Add time to avoid timezone issues
    month = date.getMonth() + 1
    day = date.getDate()
  }
  
  // Create lookup key in MM-DD format
  const key = String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0')
  
  // Look up the birth card from our real Cardology data
  const cardData = birthdateLookup[key as keyof typeof birthdateLookup]
  
  if (cardData) {
    return cardData.card
  }
  
  // Fallback if no card found
  console.error(`No birth card found for date ${birthdate} (key: ${key})`)
  return '?'
}
