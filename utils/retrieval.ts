// Step 1: Birth Card Lookup from "Birthdate to Card.csv"
export function getBirthCardFromDateCSV(month: number, day: number, birthCardMap: Record<string, string>) const mm = month.toString().padStart(2, '0');
  const dd = day.toString().padStart(2, '0');
  const key = \`\${mm}_\${dd}\`;
  return birthCardMap[key] || null;

// Step 2: Calculate Age in Timezone
export function computeAgeInTZ(birthYear: number, birthMonth: number, birthDay: number, tz = 'America/Chicago') const fmt = new Intl.DateTimeFormat('en-CA', timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit');
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find(p => p.type === t)?.value || '01';
  const today = { year: +get('year'), month: +get('month'), day: +get('day') };

  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const bday = (birthMonth === 2 && birthDay === 29 && !isLeap(today.year))
    ? { month: 2, day: 28 }
    : { month: birthMonth, day: birthDay };

  let age = today.year - birthYear;
  if (today.month < bday.month || (today.month === bday.month && today.day < bday.day)) age -= 1;
  return age;

// Step 3: Forecast Data Row (from parsed CSV)
export function getForecastRow(birthCard: string, age: number, forecastTable: any[]): any const ageStr = String(age);
  return forecastTable.find(row =>
    row['Birth Card']?.trim() === birthCard &&
    row['AGE']?.trim() === ageStr
  );

// Step 4: Planetary Period Dates Lookup
export function getPlanetaryStartDates(birthCard: string, age: number, ppTable: any[]): Record<string, string> const filtered = ppTable.filter(
    (row) => row['Birth Card'] === birthCard && row['AGE'] === String(age)
  );
  const result: Record<string, string> = {};
  filtered.forEach(row => const key = row['Period']?.trim();
    if (key) result[key] = row['Start']?.trim(););
  return result;

// Step 5: Get Activities for each forecast card
export function getCardActivities(cards: string[], activityTable: any[]): Record<string, string> const activityMap: Record<string, string> = {};
  cards.forEach(card => const match = activityTable.find(row => row['card']?.trim() === card);
    if (match) activityMap[card] = match['activities']?.trim(););
  return activityMap;

// Image Path Helper
export function getCardImagePath(card: string): string const suitMap: Record<string, string> = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' };
  const value = card.slice(0, -1);
  const suit = suitMap[card.slice(-1)] || card.slice(-1);
  return `/cards/${value}${suit}.png`;