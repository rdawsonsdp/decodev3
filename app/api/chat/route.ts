import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_INSTRUCTION = `You are a compassionate Cardology-based parenting guide. Use the child's birth card, current age, forecast card spread, and planetary period to answer questions about their behavior, needs, and gifts. Ground your insights in the emotional intent of the reading. Speak in a warm, grounded, emotionally attuned tone—like a wise parenting coach who blends real-life wisdom with cosmic insight.`

const TONE_CONTEXTS = {
  supportive: "Provide encouraging, nurturing guidance that helps parents feel confident and supported in their parenting journey.",
  practical: "Focus on actionable parenting strategies that can be implemented immediately to address specific concerns.",
  educational: "Share deeper Cardology wisdom and child development insights to help parents understand the cosmic and developmental aspects.",
  gentle: "Use a soft, patient, emotionally sensitive tone that acknowledges the parent's feelings and the child's needs with compassion.",
  empowering: "Focus on the child's strengths and gifts, building confidence in both parent and child.",
}

interface ChatRequest {
  message: string
  emotionalIntent: string
  childName: string
  birthCard: string
  currentAge: number
  yearlyForecast: any
  planetaryPeriods: any[]
  conversationHistory?: { role: string; content: string }[]
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const {
      message,
      emotionalIntent,
      childName,
      birthCard,
      currentAge,
      yearlyForecast,
      planetaryPeriods,
      conversationHistory = []
    } = body

    // Find current planetary period
    const currentPlanetaryCard = planetaryPeriods.find((p) => {
      const today = new Date()
      const startDate = new Date(p.startDate)
      const endDate = new Date(p.endDate)
      return today >= startDate && today <= endDate
    })

    // Map emotional intent to tone context
    const emotionalIntentToTone: Record<string, keyof typeof TONE_CONTEXTS> = {
      concerned: 'gentle',
      curious: 'educational',
      celebrating: 'empowering',
      supportive: 'supportive',
    }

    const toneKey = emotionalIntentToTone[emotionalIntent] || 'supportive'
    const toneContext = TONE_CONTEXTS[toneKey]

    // Build context about the child
    const childContext = `
Child Information:
- Name: ${childName}
- Birth Card: ${birthCard}
- Current Age: ${currentAge}
- Current Yearly Forecast: ${JSON.stringify(yearlyForecast, null, 2)}
- Current Planetary Period: ${currentPlanetaryCard ? `${currentPlanetaryCard.planet} - ${currentPlanetaryCard.card} (${currentPlanetaryCard.startDate} to ${currentPlanetaryCard.endDate})` : 'Not in a specific planetary period'}

Parent's Emotional Intent: ${emotionalIntent}
Tone Guidance: ${toneContext}
`

    // For now, return a simulated response
    // In production, this would call the OpenAI API
    const simulatedResponse = generateSimulatedResponse(
      message,
      emotionalIntent,
      childName,
      birthCard,
      currentAge,
      yearlyForecast,
      currentPlanetaryCard
    )

    return NextResponse.json({
      response: simulatedResponse,
      emotionalIntent,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

function generateSimulatedResponse(
  message: string,
  emotionalIntent: string,
  childName: string,
  birthCard: string,
  currentAge: number,
  yearlyForecast: any,
  currentPlanetaryCard: any
) {
  // This is a placeholder that mimics the new system instruction tone
  const responses: Record<string, string[]> = {
    concerned: [
      `I hear your concern about ${childName}, and I want you to know that what you're feeling is completely valid. As a ${birthCard} child at age ${currentAge}, they're navigating some profound energies right now. 

The ${yearlyForecast?.longRange || 'current'} influence in their yearly spread is actually creating opportunities for growth, even if it might feel challenging in the moment. ${birthCard} children often process emotions deeply, and at this age, they're learning to integrate their cosmic gifts with everyday experiences.

What specific behavior or situation has you worried? Understanding the details will help me offer more targeted guidance that honors both ${childName}'s cosmic blueprint and your parenting wisdom.`,
    ],
    curious: [
      `What a beautiful question about ${childName}! Their ${birthCard} birth card holds such fascinating wisdom. At age ${currentAge}, they're in a particularly rich developmental phase where their cosmic blueprint really starts to shine through.

This year's ${yearlyForecast?.longRange || 'Long Range'} card brings themes that perfectly complement their natural ${birthCard} energy. ${currentPlanetaryCard ? `Right now, they're also experiencing the ${currentPlanetaryCard.planet} influence through the ${currentPlanetaryCard.card}, which adds another layer of depth to their personality.` : ''}

${birthCard} children are known for their ${birthCard.includes('♥') ? 'deep emotional intelligence and capacity for love' : birthCard.includes('♣') ? 'brilliant minds and natural communication gifts' : birthCard.includes('♦') ? 'practical wisdom and strong value systems' : 'pioneering spirit and leadership qualities'}. How are you noticing these qualities manifesting in ${childName}'s daily life?`,
    ],
    celebrating: [
      `Oh, how wonderful! I can feel your joy radiating through, and it's absolutely warranted. ${childName}'s ${birthCard} energy is truly blossoming! At age ${currentAge}, they're in such a magical phase where their cosmic gifts become more visible and integrated.

The ${yearlyForecast?.result || 'Result'} card in their yearly spread speaks to exactly this kind of breakthrough or achievement. As a ${birthCard} child, they have unique gifts that are now finding beautiful expression. ${currentPlanetaryCard ? `The current ${currentPlanetaryCard.planet} period (${currentPlanetaryCard.card}) is amplifying these positive energies even more.` : ''}

What specific milestone or growth are you celebrating? I'd love to help you understand how this connects to their deeper cosmic blueprint and what it means for their continued development.`,
    ],
    supportive: [
      `Your supportive presence is such a gift to ${childName}. As a ${birthCard} child at age ${currentAge}, they're in a phase where your understanding and encouragement make all the difference in how they integrate their cosmic gifts.

The ${yearlyForecast?.development || 'Development'} card in their spread shows they're working on important inner growth right now. Your intuition to offer support is perfectly aligned with what their cosmic blueprint is calling for at this time.

${birthCard} children particularly thrive when they feel seen and understood for who they truly are. Your supportive approach is helping ${childName} build the confidence to express their authentic self. What aspects of their personality or behavior are you most wanting to support right now?`,
    ],
  }

  const intentResponses = responses[emotionalIntent] || responses.curious
  return intentResponses[0]
}