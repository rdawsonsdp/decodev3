import React, { useState, useEffect } from 'react';
import { getBirthCardFromDate } from '../utils/getBirthCardFromDate';
import { BirthCardDisplay } from './BirthCardDisplay';

const BirthCardLookup = ({ onBirthCardCalculated, onBirthCardClick }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [birthCard, setBirthCard] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month) => {
    const daysInMonth = {
      'January': 31, 'February': 29, 'March': 31, 'April': 30,
      'May': 31, 'June': 30, 'July': 31, 'August': 31,
      'September': 30, 'October': 31, 'November': 30, 'December': 31
    };
    return Array.from({length: daysInMonth[month] || 31}, (_, i) => i + 1);
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  const calculateBirthCard = () => {
    if (selectedMonth && selectedDay && selectedYear) {
      const dateStr = `${selectedMonth} ${selectedDay}`;
      const cardData = getBirthCardFromDate(dateStr);
      
      if (cardData.card) {
        setBirthCard(cardData);
        onBirthCardCalculated(cardData, parseInt(selectedYear), selectedMonth, parseInt(selectedDay));
      } else {
        console.error('No card found for date:', dateStr);
        setBirthCard(null);
      }
    }
  };

  // Auto-calculate when all fields are selected
  useEffect(() => {
    calculateBirthCard();
  }, [selectedMonth, selectedDay, selectedYear]);

  const handleBirthCardClick = () => {
    if (birthCard && onBirthCardClick) {
      onBirthCardClick();
    }
  };

  return (
    <div className="card">
      <h2>🎴 Birth Card Lookup</h2>
      
      <div className="date-selectors">
        <div className="form-group">
          <label>Month</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Day</label>
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(e.target.value)}
            disabled={!selectedMonth}
          >
            <option value="">Select Day</option>
            {selectedMonth && getDaysInMonth(selectedMonth).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Year</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {getYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {birthCard && selectedMonth && selectedDay && (
        <BirthCardDisplay 
          month={selectedMonth}
          day={selectedDay}
          onBirthCardClick={handleBirthCardClick}
        />
      )}
    </div>
  );
};

export default BirthCardLookup;
