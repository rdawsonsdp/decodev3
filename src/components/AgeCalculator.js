import React, { useState, useEffect } from 'react';

const AgeCalculator = ({ birthYear, age, onAgeChange }) => {
  const [editableAge, setEditableAge] = useState(age);

  useEffect(() => {
    setEditableAge(age);
  }, [age]);

  const handleAgeChange = (e) => {
    const newAge = parseInt(e.target.value);
    if (!isNaN(newAge) && newAge >= 0 && newAge <= 100) {
      setEditableAge(newAge);
      onAgeChange(newAge);
    }
  };

  const getCurrentAge = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const resetToCurrentAge = () => {
    const currentAge = getCurrentAge();
    setEditableAge(currentAge);
    onAgeChange(currentAge);
  };

  return (
    <div className="age-calculator">
      <h3>🧒 Child's Age</h3>
      
      <div className="form-group">
        <label>Current Age (Auto-calculated, but editable)</label>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <input
            type="number"
            min="0"
            max="100"
            value={editableAge}
            onChange={handleAgeChange}
            style={{width: '80px'}}
          />
          <span>years old</span>
          <button 
            className="btn" 
            onClick={resetToCurrentAge}
            style={{fontSize: '12px', padding: '5px 10px'}}
          >
            Reset to Current
          </button>
        </div>
      </div>

      <div style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
        <p>Birth Year: {birthYear}</p>
        <p>Current Age: {getCurrentAge()} years</p>
        <p>Forecast Age: {editableAge} years</p>
      </div>

      <div style={{fontSize: '12px', color: '#888', marginTop: '10px', fontStyle: 'italic'}}>
        💡 Tip: Change the age to see different yearly forecasts for your child
      </div>
    </div>
  );
};

export default AgeCalculator;
