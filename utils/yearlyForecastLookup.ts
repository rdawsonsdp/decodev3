export function getYearlyForecast(birthCard: string, age: number) // Mock yearly forecast data - in real app, this would come from your JSON files
  // For testing with 5♦ at age 51 (as of 2025)
  if (birthCard === '5♦' && age === 51) return (longRange: '7♦',
      pluto: '2♦', 
      result: 'A♣',
      support: 'A♠',
      development: '5♣'
    }
  }
  
  // Generate forecast based on birth card and age
  const cards = ['A♠', 'A♥', 'A♦', 'A♣', '2♠', '2♥', '2♦', '2♣', '3♠', '3♥', '3♦', '3♣',
                 '4♠', '4♥', '4♦', '4♣', '5♠', '5♥', '5♦', '5♣', '6♠', '6♥', '6♦', '6♣',
                 '7♠', '7♥', '7♦', '7♣', '8♠', '8♥', '8♦', '8♣', '9♠', '9♥', '9♦', '9♣',
                 '10♠', '10♥', '10♦', '10♣', 'J♠', 'J♥', 'J♦', 'J♣', 'Q♠', 'Q♥', 'Q♦', 'Q♣',
                 'K♠', 'K♥', 'K♦', 'K♣']
  
  const baseIndex = cards.indexOf(birthCard) || 0
  
  return (longRange: cards[(baseIndex + age) % cards.length],
    pluto: cards[(baseIndex + age + 7) % cards.length],
    result: cards[(baseIndex + age + 14) % cards.length], 
    support: cards[(baseIndex + age + 21) % cards.length],
    development: cards[(baseIndex + age + 28) % cards.length]
  }
}
