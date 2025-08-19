import React, { useState, useRef, useEffect } from 'react';
import { getCheckoutUrl } from '../config/access';

/* System Persona for backend integration:
You are a compassionate Cardology-based parenting guide. Use the child’s birth card, current age,
yearly spread, and planetary period to answer questions. Speak in a warm, grounded tone.
*/
const GPTChat = ({ birthCard, age, currentReading, emotionalIntent = 'supportive', userTier = 'free' }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* ACCESS GATE */
  const premium = userTier === 'premium';
  const messagesEndRef = useRef(null);
  const initialWelcome = "Hi there! I’m here to help you understand your child’s needs, gifts, and growth path through the lens of Cardology. Ask me anything—let’s support their journey together.";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 0) { setMessages([{ role: 'assistant', content: initialWelcome }]); }

    scrollToBottom();
  }, [messages]);

  // Initialize with a welcome message
  useEffect(() => {
    if (messages.length === 0) { setMessages([{ role: 'assistant', content: initialWelcome }]); }

    if (birthCard && messages.length === 0) {
      const intentContext = getIntentWelcomeMessage(emotionalIntent);
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        content: `Hi! I'm here to help you understand your child better.`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [birthCard, age, messages.length, emotionalIntent]);

  const getIntentWelcomeMessage = (intent) => {
    const intentMessages = {
      supportive: "I'm here to provide encouraging, nurturing guidance that celebrates your child's unique qualities.",
      practical: "I'll focus on actionable strategies and concrete steps you can take to support your child.",
      educational: "I'll explain the deeper meanings behind the cards and what research shows about child development.",
      gentle: "I'll offer soft, patient wisdom that honors your child's sensitivity and emotional needs.",
      empowering: "I'll help you see your child's strengths and potential, focusing on building their confidence."
    };
    return intentMessages[intent] || intentMessages.supportive;
  };

  const generateContextualResponse = (userMessage) => {
    // Simulate personalized, card-aware responses
    const responses = {
      supportive: {
        general: [
          `That's a wonderful question about your child! Given their ${birthCard?.cardName} nature, `,
          `Your child's ${birthCard?.cardName} energy brings special qualities. `,
          `With the ${birthCard?.cardName} as their birth card, your child has unique strengths. `
        ],
        specific: {
          emotions: [
            "they likely experience emotions deeply and may need extra time to process feelings.",
            "they probably have a rich inner emotional world that benefits from patient understanding.",
            "their emotional responses are often more complex than they appear on the surface."
          ],
          behavior: [
            "their behavior patterns often reflect their need for security and understanding.",
            "they may express themselves differently than other children, which is perfectly normal.",
            "their actions usually have deeper meaning related to their core emotional needs."
          ],
          development: [
            "their development journey is unique and should be honored at their own pace.",
            "they're likely developing important life skills through their current experiences.",
            "each phase of growth brings new opportunities for understanding and connection."
          ]
        }
      },
      practical: {
        general: [
          `Here's what you can do to support your ${birthCard?.cardName} child: `,
          `Practical steps for your child's ${birthCard?.cardName} nature: `,
          `Based on their birth card, here are actionable suggestions: `
        ]
      },
      educational: {
        general: [
          `Let me explain the ${birthCard?.cardName} characteristics: `,
          `Here's what research shows about children with this birth card: `,
          `Understanding your child's ${birthCard?.cardName} traits: `
        ]
      }
    };

    const currentTone = responses[emotionalIntent] || responses.supportive;
    const generalStart = currentTone.general[Math.floor(Math.random() * currentTone.general.length)];

    // Determine response category based on user message
    let category = 'emotions';
    if (userMessage.toLowerCase().includes('behav') || userMessage.toLowerCase().includes('act')) {
      category = 'behavior';
    } else if (userMessage.toLowerCase().includes('develop') || userMessage.toLowerCase().includes('grow')) {
      category = 'development';
    }

    const specificResponse = currentTone.specific?.[category]?.[Math.floor(Math.random() * currentTone.specific[category].length)] || 
                            "they have wonderful potential that unfolds in their own unique way.";

    // Add forecast context if available
    let forecastContext = '';
    if (currentReading && age) {
      const forecastSummary = Object.entries(currentReading).slice(0, 3).map(([planet, card]) => `${planet}: ${card}`).join(', ');
      forecastContext = ` This year (age ${age}), their forecast shows: ${forecastSummary}. This suggests focusing on patience and understanding as they navigate these energies.`;
    }

    return generalStart + specificResponse + forecastContext;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateContextualResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!premium) { return (
    <div style={{position:'relative', padding:'16px', border:'1px solid #e5e7eb', borderRadius:12, background:'#fafafa', textAlign:'center'}}>
      <div style={{fontWeight:700, marginBottom:6}}>GPT Q&A</div>
      <div style={{marginBottom:10}}>Unlock this insight with full access for $22.22/month.</div>
      <button style={{background:'#13293D', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer'}} onClick={() => { window.location.href = getCheckoutUrl(); }}>Upgrade</button>
    </div>
  ); }
  return (
    <div className="gpt-chat">
      <div className="chat-header">
        <h3>💬 Ask About Your Child</h3>
        <div className="chat-context">
          {birthCard && (
            <span className="context-tag">Birth Card: {birthCard.card}</span>
          )}
          {age && (
            <span className="context-tag">Age: {age}</span>
          )}
          <span className="context-tag">Tone: {emotionalIntent}</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your child's behavior, emotions, or development..."
          className="chat-input"
          rows="2"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GPTChat;
