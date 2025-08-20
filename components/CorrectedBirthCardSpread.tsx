'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Calendar, User, Edit3, Sparkles } from 'lucide-react'
import { getBirthCardFromDate } from '@/utils/getBirthCardFromDate'
import { getYearlyForecast } from '@/utils/yearlyForecastLookup'
import { getPlanetaryPeriods } from '@/utils/planetaryPeriodsLookup'
import { getCardImage } from '@/utils/getCardImage'
import CardModal from './CardModal'
import GPTChat from './GPTChat'

interface CorrectedBirthCardSpreadProps {
  childData: {
    name: string;
    birthdate: string;
  };
  onBack?: () => void;
}

export default function CorrectedBirthCardSpread({ childData, onBack }: CorrectedBirthCardSpreadProps) {
  const [currentAge, setCurrentAge] = useState(0);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{ card: string; type: string } | null>(null);
  const [birthCard, setBirthCard] = useState('');
  const [yearlyForecast, setYearlyForecast] = useState<any>(null);
  const [planetaryPeriods, setPlanetaryPeriods] = useState<any[]>([]);
  const [currentPlanetaryPeriod, setCurrentPlanetaryPeriod] = useState<string>('');
  const [savedProfiles, setSavedProfiles] = useState<{ name: string; birthdate: string }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('savedReadings');
    if (stored) {
      setSavedProfiles(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Calculate initial age
    const today = new Date();
    const [year, month, day] = childData.birthdate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    setCurrentAge(age);

    // Get birth card
    const card = getBirthCardFromDate(childData.birthdate);
    setBirthCard(card);
  }, [childData.birthdate]);

  useEffect(() => {
    if (birthCard && currentAge >= 0) {
      // Get yearly forecast
      const forecast = getYearlyForecast(birthCard, currentAge);
      setYearlyForecast(forecast);

      // Get planetary periods
      const periods = getPlanetaryPeriods(birthCard, currentAge, childData.birthdate);
      setPlanetaryPeriods(periods);

      // Determine current planetary period
      const today = new Date();
      const currentPeriod = periods.find(period => {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        return today >= startDate && today <= endDate;
      });
      setCurrentPlanetaryPeriod(currentPeriod?.planet || '');
    }
  }, [birthCard, currentAge, childData.birthdate]);

  const handleCardClick = (card: string, type: string) => {
    setSelectedCard({ card, type });
  };

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingAge(false);
  };

  const saveProfile = () => {
    const newProfile = { name: childData.name, birthdate: childData.birthdate };
    const updated = [...savedProfiles, newProfile];
    setSavedProfiles(updated);
    localStorage.setItem('savedReadings', JSON.stringify(updated));
  };

  const deleteProfile = () => {
    const updated = savedProfiles.filter(
      (p) => !(p.name === childData.name && p.birthdate === childData.birthdate)
    );
    setSavedProfiles(updated);
    localStorage.setItem('savedReadings', JSON.stringify(updated));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 flex items-center gap-2 hover:bg-white/50 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
        )}

        {/* Top Left Info Panel */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <Label className="text-sm text-gray-600">Child's Name</Label>
                  <p className="font-semibold text-lg text-gray-800">{childData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <Label className="text-sm text-gray-600">Date of Birth</Label>
                  <p className="font-semibold text-lg text-gray-800">
                    {new Date(childData.birthdate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-600">Age</Label>
                  {isEditingAge ? (
                    <form onSubmit={handleAgeSubmit} className="flex gap-2">
                      <Input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                        className="w-20 h-8"
                        min="0"
                        max="100"
                      />
                      <Button type="submit" size="sm" className="h-8">
                        Save
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-gray-800">{currentAge}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingAge(true)}
                        className="h-6 px-2 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={saveProfile}
                        className="h-6 px-2 text-xs"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={deleteProfile}
                        className="h-6 px-2 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yearly Energetic Outlook */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Yearly Energetic Outlook
            </CardTitle>
            <p className="text-center text-gray-600">
              {childData.name}'s energetic outlook for age {currentAge}
            </p>
          </CardHeader>
          <CardContent>
            {yearlyForecast && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* Birth Card */}
                <div className="text-center group">
                  <h4 className="font-semibold text-purple-800 text-sm">Birth Card</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(birthCard) || '/placeholder.svg'}
                      alt={birthCard}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-purple-200"
                      onClick={() => handleCardClick(birthCard, 'birth')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>
                  <p className="text-xs text-gray-600">{birthCard}</p>
                </div>

                {/* Long Range */}
                <div className="text-center group">
                  <h4 className="font-semibold text-blue-800 text-sm">Long Range</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(yearlyForecast.longRange) || '/placeholder.svg'}
                      alt={yearlyForecast.longRange}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-blue-200"
                      onClick={() => handleCardClick(yearlyForecast.longRange, 'forecast')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>

                {/* Pluto */}
                <div className="text-center group">
                  <h4 className="font-semibold text-red-800 text-sm">Pluto</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(yearlyForecast.pluto) || '/placeholder.svg'}
                      alt={yearlyForecast.pluto}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-red-200"
                      onClick={() => handleCardClick(yearlyForecast.pluto, 'forecast')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>

                {/* Result */}
                <div className="text-center group">
                  <h4 className="font-semibold text-green-800 text-sm">Result</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(yearlyForecast.result) || '/placeholder.svg'}
                      alt={yearlyForecast.result}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-green-200"
                      onClick={() => handleCardClick(yearlyForecast.result, 'forecast')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>
                  <p className="text-xs text-gray-600">{yearlyForecast.result}</p>
                </div>

                {/* Support */}
                <div className="text-center group">
                  <h4 className="font-semibold text-yellow-800 text-sm">Support</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(yearlyForecast.support) || '/placeholder.svg'}
                      alt={yearlyForecast.support}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-yellow-200"
                      onClick={() => handleCardClick(yearlyForecast.support, 'forecast')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>

                {/* Development */}
                <div className="text-center group">
                  <h4 className="font-semibold text-indigo-800 text-sm">Development</h4>
                  <div className="relative">
                    <img
                      src={getCardImage(yearlyForecast.development) || '/placeholder.svg'}
                      alt={yearlyForecast.development}
                      className="w-full max-w-24 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:shadow-indigo-200"
                      onClick={() => handleCardClick(yearlyForecast.development, 'forecast')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </div>
            )}
          </CardContent>
        </Card>

        {/* Planetary Period Cards */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Card Ruling Each 52-day Planetary Period
            </CardTitle>
            <p className="text-center text-gray-600">
              Current planetary influences throughout the year
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {planetaryPeriods.map((period, index) => (
                <div
                  key={period.planet}
                  className={`text-center group ${
                    period.planet === currentPlanetaryPeriod
                      ? 'ring-2 ring-purple-500 ring-offset-2 rounded-lg p-2'
                      : ''
                  }`}
                >
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {formatDate(period.startDate)}
                    </p>
                    <h4 className="font-semibold text-sm text-purple-800">
                      {period.planet}
                    </h4>
                  </div>
                  <div className="relative">
                    <img
                      src={getCardImage(period.card) || '/placeholder.svg'}
                      alt={period.card}
                      className={`w-full max-w-20 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                        period.planet === currentPlanetaryPeriod
                          ? 'ring-2 ring-purple-400 shadow-purple-200'
                          : ''
                      }`}
                      onClick={() => handleCardClick(period.card, 'planetary')}
                    />
                    {period.planet === currentPlanetaryPeriod && (
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GPT Chat */}
        <GPTChat
          childName={childData.name}
          birthCard={birthCard}
          currentAge={currentAge}
          yearlyForecast={yearlyForecast}
          planetaryPeriods={planetaryPeriods}
        />

        {/* Card Modal */}
        {selectedCard && (
          <CardModal
            card={selectedCard.card}
            type={selectedCard.type}
            isOpen={!!selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </div>
    </div>
  );
}
