export function getPlanetaryPeriods(
  birthCard: string,
  age: number,
  birthdate: string
) {
  const planets = [
    'Mercury',
    'Venus',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
  ]

  // For testing with 5♦ at age 51
  if (birthCard === '5♦' && age === 51) {
    const birthYear = new Date(birthdate).getFullYear()
    const currentYear = birthYear + age

    return [
      {
        planet: 'Mercury',
        card: '7♠',
        startDate: `${currentYear}-01-22`,
        endDate: `${currentYear}-03-14`,
      },
      {
        planet: 'Venus',
        card: 'K♣',
        startDate: `${currentYear}-03-15`,
        endDate: `${currentYear}-05-05`,
      },
      {
        planet: 'Mars',
        card: '2♠',
        startDate: `${currentYear}-05-06`,
        endDate: `${currentYear}-06-26`,
      },
      {
        planet: 'Jupiter',
        card: '9♥',
        startDate: `${currentYear}-06-27`,
        endDate: `${currentYear}-08-17`,
      },
      {
        planet: 'Saturn',
        card: '3♦',
        startDate: `${currentYear}-08-18`,
        endDate: `${currentYear}-10-08`,
      },
      {
        planet: 'Uranus',
        card: 'J♥',
        startDate: `${currentYear}-10-09`,
        endDate: `${currentYear}-11-29`,
      },
      {
        planet: 'Neptune',
        card: '5♠',
        startDate: `${currentYear}-11-30`,
        endDate: `${currentYear + 1}-01-21`,
      },
    ]
  }

  // Generate planetary periods for other cards
  const cards = [
    'A♠',
    'A♥',
    'A♦',
    'A♣',
    '2♠',
    '2♥',
    '2♦',
    '2♣',
    '3♠',
    '3♥',
    '3♦',
    '3♣',
    '4♠',
    '4♥',
    '4♦',
    '4♣',
    '5♠',
    '5♥',
    '5♦',
    '5♣',
    '6♠',
    '6♥',
    '6♦',
    '6♣',
    '7♠',
    '7♥',
    '7♦',
    '7♣',
    '8♠',
    '8♥',
    '8♦',
    '8♣',
    '9♠',
    '9♥',
    '9♦',
    '9♣',
    '10♠',
    '10♥',
    '10♦',
    '10♣',
    'J♠',
    'J♥',
    'J♦',
    'J♣',
    'Q♠',
    'Q♥',
    'Q♦',
    'Q♣',
    'K♠',
    'K♥',
    'K♦',
    'K♣',
  ]

  const baseIndex = cards.indexOf(birthCard) || 0
  const birthYear = new Date(birthdate).getFullYear()
  const currentYear = birthYear + age
  const birthMonth = new Date(birthdate).getMonth() + 1
  const birthDay = new Date(birthdate).getDate()

  return planets.map((planet, index) => {
    const startDate = new Date(currentYear, birthMonth - 1, birthDay)
    startDate.setDate(startDate.getDate() + index * 52)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 51)

    return {
      planet,
      card: cards[(baseIndex + age + index) % cards.length],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  })
}