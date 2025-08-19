import React, { useState, useEffect } from 'react';

const JourneyTracker = ({ savedReadings, emotionalIntent }) => {
  const [timeFrame, setTimeFrame] = useState('6months');
  const [patterns, setPatterns] = useState({});
  const [insights, setInsights] = useState([]);

  const getIntentMeaning = (intent) => {
    const meanings = {
      'supportive': 'encouraging and nurturing',
      'practical': 'actionable and concrete',
      'educational': 'informative and research-based',
      'gentle': 'soft and patient',
      'empowering': 'confidence-building and strength-focused'
    };
    return meanings[intent] || 'personalized';
  };

  useEffect(() => {
    if (savedReadings?.length > 0) {
      analyzePatterns();
    }
  }, [savedReadings, timeFrame]);

  const analyzePatterns = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeFrame) {
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setMonth(now.getMonth() - 6);
    }

    const relevantReadings = savedReadings.filter(reading => 
      new Date(reading.savedAt) >= cutoffDate
    );

    if (relevantReadings.length === 0) {
      setPatterns({});
      setInsights([]);
      return;
    }

    // Analyze card frequency patterns
    const cardFrequency = {};
    const planetFrequency = {};
    const ageProgression = [];
    const intentFrequency = {};

    relevantReadings.forEach(reading => {
      // Track birth card
      if (reading.birthCard?.card) {
        cardFrequency[reading.birthCard.card] = (cardFrequency[reading.birthCard.card] || 0) + 1;
      }

      // Track forecast cards by planet
      if (reading.forecastCards) {
        Object.entries(reading.forecastCards).forEach(([planet, card]) => {
          if (!planetFrequency[planet]) planetFrequency[planet] = {};
          planetFrequency[planet][card] = (planetFrequency[planet][card] || 0) + 1;
        });
      }

      // Track emotional intent patterns
      if (reading.emotionalIntent) {
        intentFrequency[reading.emotionalIntent] = (intentFrequency[reading.emotionalIntent] || 0) + 1;
      }

      // Track age progression
      ageProgression.push({
        age: reading.age,
        date: reading.savedAt,
        birthCard: reading.birthCard?.card
      });
    });

    setPatterns({
      cardFrequency,
      planetFrequency,
      intentFrequency,
      totalReadings: relevantReadings.length,
      ageRange: {
        min: Math.min(...ageProgression.map(r => r.age)),
        max: Math.max(...ageProgression.map(r => r.age))
      }
    });

    generateInsights(relevantReadings, cardFrequency, planetFrequency, intentFrequency);
  };

  const generateInsights = (readings, cardFreq, planetFreq, intentFreq) => {
    const insights = [];

    // Reading frequency insight
    if (readings.length > 1) {
      const daysBetween = (new Date(readings[readings.length - 1].savedAt) - new Date(readings[0].savedAt)) / (1000 * 60 * 60 * 24);
      const avgDaysBetween = Math.round(daysBetween / (readings.length - 1));
      insights.push({
        type: 'frequency',
        icon: '📅',
        title: 'Reading Pattern',
        description: `You check in every ${avgDaysBetween} days on average. ${avgDaysBetween < 7 ? 'You\'re very engaged with tracking your child\'s development!' : 'Consider checking in more frequently to spot patterns.'}`
      });
    }

    // Most common forecast themes
    const mercuryCards = Object.entries(planetFreq.Mercury || {}).sort((a, b) => b[1] - a[1]);
    if (mercuryCards.length > 0) {
      insights.push({
        type: 'mercury',
        icon: '💭',
        title: 'Communication Patterns',
        description: `Mercury (communication) shows ${mercuryCards[0][0]} most often, suggesting your child benefits from ${getMercuryAdvice(mercuryCards[0][0])}.`
      });
    }

    // Emotional patterns (Hearts)
    const heartCards = Object.entries(planetFreq.Venus || {}).filter(([card]) => card.includes('H')).sort((a, b) => b[1] - a[1]);
    if (heartCards.length > 0) {
      insights.push({
        type: 'emotions',
        icon: '❤️',
        title: 'Emotional Themes',
        description: `Heart cards appear frequently in Venus (relationships), indicating your child values emotional connections and may need extra support with feelings.`
      });
    }

    // Growth insight
    const ages = readings.map(r => r.age).sort((a, b) => a - b);
    if (ages.length > 1 && ages[ages.length - 1] > ages[0]) {
      insights.push({
        type: 'growth',
        icon: '🌱',
        title: 'Development Journey',
        description: `You've tracked growth from age ${ages[0]} to ${ages[ages.length - 1]}. This shows your commitment to understanding your child's evolving needs.`
      });
    }

    // Intent pattern insight
    if (intentFreq && Object.keys(intentFreq).length > 0) {
      const topIntent = Object.entries(intentFreq).sort((a, b) => b[1] - a[1])[0];
      insights.push({
        type: 'intent',
        icon: '🎯',
        title: 'Emotional Focus',
        description: `Your most common emotional intent is "${topIntent[0]}", used in ${topIntent[1]} reading${topIntent[1] > 1 ? 's' : ''}. This shows you're consistently seeking ${getIntentMeaning(topIntent[0])} guidance.`
      });
    }

    // Notes insight
    const notedReadings = readings.filter(r => r.notes && r.notes.trim());
    if (notedReadings.length > 0) {
      insights.push({
        type: 'reflection',
        icon: '📝',
        title: 'Reflection Practice',
        description: `You've added personal notes to ${Math.round((notedReadings.length / readings.length) * 100)}% of your readings. This self-reflection helps you understand your child better.`
      });
    }

    setInsights(insights);
  };

  const getMercuryAdvice = (card) => {
    const advice = {
      'AC': 'intellectual stimulation and learning opportunities',
      'AD': 'clear structure and valuable conversations',
      'AH': 'emotional expression and heart-to-heart talks',
      'AS': 'wisdom-sharing and deep discussions'
    };
    return advice[card] || 'patient, understanding communication';
  };

  const formatTimeFrame = (tf) => {
    const labels = {
      '1month': 'Last Month',
      '3months': 'Last 3 Months', 
      '6months': 'Last 6 Months',
      '1year': 'Last Year'
    };
    return labels[tf] || 'Last 6 Months';
  };

  return (
    <div className="journey-tracker">
      <div className="tracker-header">
        <h3>🌀 Journey Tracker</h3>
        <p>Discover patterns in your child's development over time</p>
        
        <div className="timeframe-selector">
          <label>Time Frame: </label>
          <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {patterns.totalReadings === 0 ? (
        <div className="no-data">
          <p>No readings found for {formatTimeFrame(timeFrame).toLowerCase()}.</p>
          <p>Save some readings to start tracking patterns!</p>
        </div>
      ) : (
        <>
          <div className="pattern-stats">
            <div className="stat-card">
              <div className="stat-number">{patterns.totalReadings}</div>
              <div className="stat-label">Readings</div>
            </div>
            {patterns.ageRange && (
              <div className="stat-card">
                <div className="stat-number">
                  {patterns.ageRange.min === patterns.ageRange.max 
                    ? patterns.ageRange.min 
                    : `${patterns.ageRange.min}-${patterns.ageRange.max}`}
                </div>
                <div className="stat-label">Age Range</div>
              </div>
            )}
          </div>

          <div className="insights-section">
            <h4>✨ Insights & Patterns</h4>
            {insights.length === 0 ? (
              <p>Collecting insights... Save more readings to see patterns!</p>
            ) : (
              <div className="insights-grid">
                {insights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <div className="insight-icon">{insight.icon}</div>
                    <div className="insight-content">
                      <h5>{insight.title}</h5>
                      <p>{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {patterns.planetFrequency && Object.keys(patterns.planetFrequency).length > 0 && (
            <div className="planet-patterns">
              <h4>🪐 Planetary Themes</h4>
              <div className="planet-grid">
                {Object.entries(patterns.planetFrequency).map(([planet, cards]) => {
                  const topCard = Object.entries(cards).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <div key={planet} className="planet-pattern">
                      <h5>{planet}</h5>
                      <div className="top-card">
                        {topCard[0]} <span className="frequency">({topCard[1]}x)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JourneyTracker;
