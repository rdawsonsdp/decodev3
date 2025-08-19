import yearlyForecastsData from '../data/yearlyForecasts.json';

/**
 * Get yearly forecast cards for a birth card and age
 * @param {string} birthCard - Birth card (e.g., "4♦")
 * @param {number} age - Current age
 * @returns {Object} - Forecast data with all 10 cards
 */
export function getYearlyForecast(birthCard, age) {
  const cardData = yearlyForecastsData[birthCard];
  
  if (!cardData) {
    return {
      birthCard,
      age,
      forecast: null,
      error: `No forecast data found for birth card: ${birthCard}`
    };
  }
  
  const ageData = cardData.find(entry => entry.age === age);
  
  if (!ageData) {
    return {
      birthCard,
      age,
      forecast: null,
      error: `No forecast data found for age ${age}`
    };
  }
  
  const forecastData = {
    Mercury: ageData.mercury,
    Venus: ageData.venus,
    Mars: ageData.mars,
    Jupiter: ageData.jupiter,
    Saturn: ageData.saturn,
    Uranus: ageData.uranus,
    Neptune: ageData.neptune,
    "Long Range": ageData.longRange,
    Pluto: ageData.pluto,
    Result: ageData.result,
    Support: ageData.support,
    Development: ageData.development
  };
  
  return {
    birthCard,
    age,
    forecast: forecastData,
    error: null
  };
}

/**
 * Get the 6 specific cards for the yearly spread
 * @param {string} birthCard - Birth card
 * @param {Object} forecast - Full forecast data
 * @returns {Object} - The 6 cards for yearly spread
 */
export function getYearlySpreadCards(birthCard, forecast) {
  return {
    birthCard: birthCard,
    longRange: forecast["Long Range"],
    pluto: forecast.Pluto,
    result: forecast.Result,
    support: forecast.Support || forecast.Saturn, // Support might be Saturn in some systems
    development: forecast.Development || forecast.Mercury // Development might be Mercury
  };
}

/**
 * Get planetary period cards with dates
 * @param {Object} forecast - Forecast data
 * @param {string} birthdate - Birthdate in YYYY-MM-DD format
 * @param {number} age - Current age
 * @returns {Array} - Array of planetary periods with cards and dates
 */
export function getPlanetaryPeriods(forecast, birthdate, age) {
  const birthDate = new Date(birthdate);
  const currentYear = new Date().getFullYear();
  const birthYear = birthDate.getFullYear();
  const ageYearStart = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // Calculate period dates based on age year
  const periods = [
    { name: "Mercury", card: forecast.Mercury, startDate: ageYearStart, duration: 52 },
    { name: "Venus", card: forecast.Venus, startDate: new Date(ageYearStart.getTime() + 52 * 24 * 60 * 60 * 1000), duration: 52 },
    { name: "Mars", card: forecast.Mars, startDate: new Date(ageYearStart.getTime() + 104 * 24 * 60 * 60 * 1000), duration: 52 },
    { name: "Jupiter", card: forecast.Jupiter, startDate: new Date(ageYearStart.getTime() + 156 * 24 * 60 * 60 * 1000), duration: 52 },
    { name: "Saturn", card: forecast.Saturn, startDate: new Date(ageYearStart.getTime() + 208 * 24 * 60 * 60 * 1000), duration: 52 },
    { name: "Uranus", card: forecast.Uranus, startDate: new Date(ageYearStart.getTime() + 260 * 24 * 60 * 60 * 1000), duration: 52 },
    { name: "Neptune", card: forecast.Neptune, startDate: new Date(ageYearStart.getTime() + 312 * 24 * 60 * 60 * 1000), duration: 53 }
  ];
  
  // Add end dates and current status
  const today = new Date();
  return periods.map((period, index) => {
    const endDate = new Date(period.startDate.getTime() + period.duration * 24 * 60 * 60 * 1000);
    const isCurrent = today >= period.startDate && today < endDate;
    
    return {
      ...period,
      endDate,
      isCurrent,
      dateRange: `${period.startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    };
  });
}
