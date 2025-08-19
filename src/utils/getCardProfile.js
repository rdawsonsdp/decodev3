import cardProfiles from '../data/DYKCardProfiles.json';

export function getCardProfile(card) {
  return cardProfiles.find(p => p.Card === card);
}
