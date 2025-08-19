import birthCardData from '../data/birthdateToCard.json';

/**
 * Get birth card from birthdate using the correct CSV data structure
 * @param {string} month - Month name (e.g., "October") 
 * @param {number} day - Day of month (e.g., 5)
 * @returns {Object} - {card, cardName, error}
 */
export function getBirthCardFromDate(month, day) {
  // Create date string in format "Month Day" (e.g., "October 5")
  const dateString = `${month} ${day}`;
  
  const match = birthCardData.find(row => row.Date?.trim() === dateString.trim());
  
  if (!match) {
    return {
      card: null,
      cardName: null,
      error: `No card found for ${dateString}`
    };
  }
  
  return {
    card: match.Card,
    cardName: match["Card Name"]
  };
}

/**
 * Calculate correct age accounting for whether birthday has passed this year
 * @param {string} birthdate - Birthdate in YYYY-MM-DD format
 * @returns {number} - Current age
 */
export function calculateCorrectAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // Check if birthday has passed this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  
  return age;
}

/**
 * Parse date string and extract month name and day
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Object} - {month, day}
 */
export function parseBirthdate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return {
    month: monthNames[date.getMonth()],
    day: date.getDate()
  };
}
