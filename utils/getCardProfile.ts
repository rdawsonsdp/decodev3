interface CardProfile name: string
  description: string

export function getCardProfile(card: string, type: string): CardProfile // Mock card profiles - in real app, this would come from your JSON data
  const profiles: { [key: string]: CardProfile } = '5♦': name: 'Five of Diamonds - The Salesperson',
      description: `The Five of Diamonds represents natural sales ability, versatility, and the desire for financial security. Children with this card are often:

• Natural communicators who can persuade and influence others
• Adaptable and able to handle change well
• Interested in money, value, and material security from an early age
• Restless and always looking for new opportunities
• Gifted at seeing potential in people and situations

As a parent, support their entrepreneurial spirit while teaching them the value of patience and long-term planning. They may struggle with commitment but excel when given variety and freedom to explore different interests.

Their challenge is learning to stick with things long enough to see real results, rather than jumping to the next opportunity too quickly.`,
    '7♦': name: 'Seven of Diamonds - The Spiritual Money Card',
      description: `The Seven of Diamonds represents spiritual values around money and material success. These children often:

• Have an intuitive understanding of value and worth
• May struggle between spiritual and material desires
• Are naturally gifted at manifesting what they need
• Have lessons around trust and faith in abundance
• Often become successful through following their spiritual path

Support them by helping them understand that money and spirituality can work together harmoniously.`,
    '2♦': name: 'Two of Diamonds - The Cooperation Card',
      description: `The Two of Diamonds represents cooperation in values and material matters. These children:

• Work best in partnership and collaboration
• Have strong values about fairness and equality
• May struggle with decision-making when alone
• Excel when they have a trusted partner or team
• Learn important lessons about compromise and sharing

Encourage their collaborative nature while helping them develop confidence in their own decisions.`,
    'A♣': name: 'Ace of Clubs - The Desire for Knowledge',
      description: `The Ace of Clubs represents the pure desire for knowledge and communication. These children:

• Are natural students and teachers
• Have an insatiable curiosity about everything
• Excel in communication and learning
• May scatter their energy across too many interests
• Have the potential for great wisdom and insight

Support their love of learning while helping them focus their abundant mental energy.`,
    'A♠': name: 'Ace of Spades - The Magician',
      description: `The Ace of Spades is the most powerful card in the deck, representing transformation, mystery, and deep spiritual insight. These children are:

• Natural leaders with strong willpower
• Drawn to mysteries and hidden knowledge  
• Capable of profound transformation and growth
• Often old souls with wisdom beyond their years
• Magnetic personalities that draw others to them

They need parents who can handle their intensity and support their quest for deeper meaning.`,
    '5♣': name: 'Five of Clubs - The Communicator',
      description: `The Five of Clubs represents versatile communication and mental restlessness. These children:

• Are gifted speakers and writers
• Have active, curious minds that need stimulation
• May struggle with focus and commitment
• Excel when given variety and mental challenges
• Have natural teaching and mentoring abilities

Support their communication gifts while helping them develop patience and follow-through.`
  
  return profiles[card] || name: `${card} Card`,
    description: `This card represents unique qualities and life lessons. Children with this card have special gifts that unfold over time through their experiences and growth.

Each card in the deck carries its own energy and wisdom. Your child's cosmic blueprint includes multiple influences that work together to create their unique personality and life path.

The beauty of Cardology is that it helps us understand not just who our children are, but who they're becoming as they grow and evolve.`
