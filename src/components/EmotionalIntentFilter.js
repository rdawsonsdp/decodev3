import React, { useState } from 'react';

const EmotionalIntentFilter = ({ currentIntent, onIntentChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const intentOptions = [
    {
      id: 'supportive',
      name: 'Supportive',
      icon: '🤗',
      description: 'Nurturing, encouraging, focused on emotional support',
      color: '#4CAF50'
    },
    {
      id: 'practical',
      name: 'Practical',
      icon: '🛠️',
      description: 'Action-oriented, solution-focused, concrete steps',
      color: '#2196F3'
    },
    {
      id: 'educational',
      name: 'Educational',
      icon: '📚',
      description: 'Informative, research-based, developmental insights',
      color: '#FF9800'
    },
    {
      id: 'gentle',
      name: 'Gentle',
      icon: '🌸',
      description: 'Soft, patient, extra understanding for sensitive topics',
      color: '#E91E63'
    },
    {
      id: 'empowering',
      name: 'Empowering',
      icon: '💪',
      description: 'Strength-focused, confidence-building, celebrating progress',
      color: '#9C27B0'
    }
  ];

  const currentIntentData = intentOptions.find(opt => opt.id === currentIntent) || intentOptions[0];

  const handleIntentSelect = (intentId) => {
    onIntentChange(intentId);
    setIsOpen(false);
  };

  return (
    <div className="emotional-intent-filter">
      <div className="intent-display">
        <label className="intent-label">🎯 Response Tone:</label>
        <button 
          className="current-intent"
          onClick={() => setIsOpen(!isOpen)}
          style={{ borderColor: currentIntentData.color }}
        >
          <span className="intent-icon">{currentIntentData.icon}</span>
          <span className="intent-name">{currentIntentData.name}</span>
          <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="intent-dropdown">
          <div className="intent-description">
            <p>Choose how you'd like responses to be tailored:</p>
          </div>
          
          <div className="intent-options">
            {intentOptions.map(option => (
              <button
                key={option.id}
                className={`intent-option ${currentIntent === option.id ? 'selected' : ''}`}
                onClick={() => handleIntentSelect(option.id)}
                style={{ 
                  borderLeftColor: option.color,
                  backgroundColor: currentIntent === option.id ? `${option.color}15` : 'transparent'
                }}
              >
                <div className="option-header">
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-name">{option.name}</span>
                  {currentIntent === option.id && <span className="selected-check">✓</span>}
                </div>
                <div className="option-description">{option.description}</div>
              </button>
            ))}
          </div>

          <div className="intent-tips">
            <h4>💡 When to use each tone:</h4>
            <ul>
              <li><strong>Supportive:</strong> When you need emotional reassurance</li>
              <li><strong>Practical:</strong> When you want specific actions to take</li>
              <li><strong>Educational:</strong> When you want to understand the "why"</li>
              <li><strong>Gentle:</strong> For sensitive topics or difficult periods</li>
              <li><strong>Empowering:</strong> To focus on strengths and celebrate growth</li>
            </ul>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="intent-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default EmotionalIntentFilter;
