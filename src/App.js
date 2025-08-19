import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Pricing from './components/Pricing';
import './App.css';
import { NameAndBirthdateForm } from './components/NameAndBirthdateForm';
import { CorrectedBirthCardSpread } from './components/CorrectedBirthCardSpread';
import BirthCardLookup from './components/BirthCardLookup';
import AgeCalculator from './components/AgeCalculator';
import ForecastSpread from './components/ForecastSpread';
import BirthCardModal from './components/BirthCardModal';
import GPTChat from './components/GPTChat';
import WisdomVault from './components/WisdomVault';
import JourneyTracker from './components/JourneyTracker';
import EmotionalIntentFilter from './components/EmotionalIntentFilter';
import OnboardingCarousel from './components/OnboardingCarousel';

function App() {
  // New comprehensive spread states
  const [showForm, setShowForm] = useState(true);
  const [childName, setChildName] = useState('');
  const [childBirthdate, setChildBirthdate] = useState('');
  const [childAge, setChildAge] = useState(0);

  // Legacy states (keeping for backward compatibility)
  const [birthCard, setBirthCard] = useState(null);
  const [age, setAge] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [showBirthCardModal, setShowBirthCardModal] = useState(false);

  // New feature states
  const [activeTab, setActiveTab] = useState('reading');
  const [savedReadings, setSavedReadings] = useState([]);
  const [emotionalIntent, setEmotionalIntent] = useState('supportive');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentForecastCards, setCurrentForecastCards] = useState(null);

  // Check for referral tracking and load saved data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('referralCode', ref);
      console.log('Referral tracked:', ref);
    }

    // Load saved readings
    const saved = localStorage.getItem('wisdomVaultReadings');
    if (saved) {
      setSavedReadings(JSON.parse(saved));
    }

    // Load emotional intent
    const intent = localStorage.getItem('emotionalIntent');
    if (intent) {
      setEmotionalIntent(intent);
    }

    // Check if user is new (show onboarding)
    const hasSeenOnboarding = localStorage.getItem('dyk-onboarded');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleBirthCardCalculated = (cardData, year, month, day) => {
    setBirthCard(cardData);
    setBirthYear(year);
    
    // Auto-calculate age considering if birthday has passed this year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based
    const currentDay = currentDate.getDate();
    
    // Convert month name to number
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const birthMonth = monthNames.indexOf(month);
    
    let calculatedAge = currentYear - year;
    
    // If birthday hasn't happened this year yet, subtract 1
    if (birthMonth > currentMonth || 
        (birthMonth === currentMonth && day > currentDay)) {
      calculatedAge--;
    }
    
    setAge(calculatedAge);
  };

  const handleAgeChange = (newAge) => {
    setAge(newAge);
  };

  const handleBirthCardClick = () => {
    setShowBirthCardModal(true);
  };

  const handleForecastCardsGenerated = useCallback((cards) => {
    setCurrentForecastCards(cards);
  }, []);

  const handleSaveReading = (reading) => {
    const newReadings = [...savedReadings, reading];
    setSavedReadings(newReadings);
    localStorage.setItem('wisdomVaultReadings', JSON.stringify(newReadings));
  };

  const handleLoadReading = (reading) => {
    setBirthCard(reading.birthCard);
    setAge(reading.age);
    setBirthYear(reading.birthYear);
    setCurrentForecastCards(reading.forecastCards);
    setActiveTab('reading');
  };

  const handleDeleteReading = (readingId) => {
    const newReadings = savedReadings.filter(r => r.id !== readingId);
    setSavedReadings(newReadings);
    localStorage.setItem('wisdomVaultReadings', JSON.stringify(newReadings));
  };

  const handleEmotionalIntentChange = (intent) => {
    setEmotionalIntent(intent);
    localStorage.setItem('emotionalIntent', intent);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleFormSubmit = (name, birthdate, age) => {
    setChildName(name);
    setChildBirthdate(birthdate);
    setChildAge(age);
    setShowForm(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reading':
        return (
  <BrowserRouter>
    <div style={{padding:'10px 14px'}}>
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <Link to="/">Home</Link>
        <Link to="/pricing">Pricing</Link>
      </div>
      <Routes>
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/" element={(
          <div className="grid grid-2">
            <div>
              <BirthCardLookup 
                onBirthCardCalculated={handleBirthCardCalculated}
                onBirthCardClick={handleBirthCardClick}
              />
              
              {birthCard && (
                <AgeCalculator
                  birthYear={birthYear}
                  age={age}
                  onAgeChange={handleAgeChange}
                />
              )}
            </div>

            <div>
              {birthCard && age && (
                <ForecastSpread
                  birthCard={birthCard}
                  age={age}
                  onForecastCardsGenerated={handleForecastCardsGenerated}
                />
              )}
            </div>
          </div>
)} />
      </Routes>
    </div>
  </BrowserRouter>
);
      case 'chat':
        return (
          <div>
            <EmotionalIntentFilter
              currentIntent={emotionalIntent}
              onIntentChange={handleEmotionalIntentChange}
            />
            <GPTChat
              birthCard={birthCard}
              age={age}
              emotionalIntent={emotionalIntent}
              currentReading={currentForecastCards}
            />
          </div>
        );
      case 'vault':
        return (
          <WisdomVault
            savedReadings={savedReadings}
            currentReading={{
              birthCard,
              age,
              birthYear,
              forecastCards: currentForecastCards
            }}
            emotionalIntent={emotionalIntent}
            onSaveReading={handleSaveReading}
            onLoadReading={handleLoadReading}
            onDeleteReading={handleDeleteReading}
          />
        );
      case 'journey':
        return (
          <JourneyTracker
            savedReadings={savedReadings}
            emotionalIntent={emotionalIntent}
          />
        );
      default:
        return null;
    }
  };

  // Show form if no child data entered yet
  if (showForm) {
    return <NameAndBirthdateForm onSubmit={handleFormSubmit} />;
  }

  // Show comprehensive spread once data is entered
  return (
    <div className="App">
      <CorrectedBirthCardSpread 
        name={childName}
        birthdate={childBirthdate}
        initialAge={childAge}
      />

      {showOnboarding && (
        <OnboardingCarousel
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}

export default App;
