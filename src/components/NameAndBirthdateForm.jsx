import React, { useState } from 'react';

export function NameAndBirthdateForm({ onSubmit }) {
  const [name, setName] = useState('Test User');
  const [birthdate, setBirthdate] = useState('1974-01-22');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && birthdate) {
      // Convert birthdate to required format
      const date = new Date(birthdate);
      const formattedDate = date.toLocaleString("default", { month: "long" }) + " " + date.getDate();
      
      // Calculate initial age
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentDay = currentDate.getDate();
      
      const birthYear = date.getFullYear();
      const birthMonth = date.getMonth();
      const birthDay = date.getDate();
      
      let calculatedAge = currentYear - birthYear;
      
      if (birthMonth > currentMonth || 
          (birthMonth === currentMonth && birthDay > currentDay)) {
        calculatedAge--;
      }
      
      onSubmit(name.trim(), formattedDate, calculatedAge);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#D4EDFF', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#13293D', 
          marginBottom: '10px',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          Decode Your Kid
        </h1>
        <p style={{ 
          color: '#134A7C', 
          marginBottom: '30px',
          fontSize: '16px'
        }}>
          Discover your child's emotional landscape through birth cards
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block',
              color: '#134A7C',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'left'
            }}>
              Child's Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '2px solid #FFD57E',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFC107'}
              onBlur={(e) => e.target.style.borderColor = '#FFD57E'}
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block',
              color: '#134A7C',
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'left'
            }}>
              Date of Birth:
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                border: '2px solid #FFD57E',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFC107'}
              onBlur={(e) => e.target.style.borderColor = '#FFD57E'}
            />
          </div>
          
          <button
            type="submit"
            style={{
              backgroundColor: '#13293D',
              color: 'white',
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '100%'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0f1f2e'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#13293D'}
          >
            Generate Birth Card Spread
          </button>
        </form>
      </div>
    </div>
  );
}
