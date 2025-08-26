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
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [editedName, setEditedName] = useState(childData.name);
  const [editedBirthdate, setEditedBirthdate] = useState(childData.birthdate);
  const [selectedCard, setSelectedCard] = useState<{ card: string; type: string } | null>(null);
  const [birthCard, setBirthCard] = useState('');
  const [yearlyForecast, setYearlyForecast] = useState<any>(null);
  const [planetaryPeriods, setPlanetaryPeriods] = useState<any[]>([]);
  const [currentPlanetaryPeriod, setCurrentPlanetaryPeriod] = useState<string>('');
  const [savedProfiles, setSavedProfiles] = useState<{ name: string; birthdate: string }[]>([]);

  const cardPositionDescriptions = {
    birth: {
      title: "Birth Card",
      description: "Your child's core personality and natural gifts. This card reveals their fundamental nature, strengths, and the energy they bring to the world.",
      insights: "Understanding this card helps you support their authentic self and natural tendencies."
    },
    longRange: {
      title: "Long Range",
      description: "The overarching theme and lessons for this year. This influence shapes major life experiences and growth opportunities.",
      insights: "This energy guides the bigger picture of what your child is learning and developing this year."
    },
    pluto: {
      title: "Pluto Card",
      description: "Deep transformation and subconscious influences. This card represents powerful inner changes and spiritual growth happening beneath the surface.",
      insights: "Pay attention to profound shifts in maturity, wisdom, and inner strength during this period."
    },
    result: {
      title: "Result Card",
      description: "The outcome and harvest of this year's experiences. This card shows what your child will accomplish or achieve by year's end.",
      insights: "This represents the fruits of their efforts and the positive changes you can expect to see."
    },
    support: {
      title: "Support Card",
      description: "The energies and influences that will help your child succeed. This card reveals sources of strength and assistance available to them.",
      insights: "Look for these supportive qualities in their environment, relationships, and natural abilities."
    },
    development: {
      title: "Development Card",
      description: "Areas of growth and skill-building focus. This card shows where your child will expand their abilities and knowledge.",
      insights: "Encourage activities and experiences that align with this developmental energy and potential."
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('savedReadings');
    if (stored) {
      setSavedProfiles(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Calculate initial age
    const today = new Date();
    const [year, month, day] = editedBirthdate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    setCurrentAge(age);

    // Get birth card
    const card = getBirthCardFromDate(editedBirthdate);
    setBirthCard(card);
  }, [editedBirthdate]);

  useEffect(() => {
    if (birthCard && currentAge >= 0) {
      // Get yearly forecast
      const forecast = getYearlyForecast(birthCard, currentAge);
      setYearlyForecast(forecast);

      // Get planetary periods
      const periods = getPlanetaryPeriods(birthCard, currentAge, editedBirthdate);
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
  }, [birthCard, currentAge, editedBirthdate]);

  const handleCardClick = (card: string, type: string) => {
    setSelectedCard({ card, type });
    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };


  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  const handleBirthdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingBirthdate(false);
    // Recalculate age and other data based on new birthdate
    const today = new Date();
    const [year, month, day] = editedBirthdate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    setCurrentAge(age);
  };

  const saveProfile = () => {
    const newProfile = { name: editedName, birthdate: editedBirthdate };
    const updated = [...savedProfiles, newProfile];
    setSavedProfiles(updated);
    localStorage.setItem('savedReadings', JSON.stringify(updated));
    
    // Add sparkle effect
    const saveButton = document.querySelector('[data-save-reading]')
    if (saveButton) {
      saveButton.classList.add('sparkle-effect')
      setTimeout(() => saveButton.classList.remove('sparkle-effect'), 1000)
    }
  };

  const deleteProfile = () => {
    const updated = savedProfiles.filter(
      (p) => !(p.name === editedName && p.birthdate === editedBirthdate)
    );
    setSavedProfiles(updated);
    localStorage.setItem('savedReadings', JSON.stringify(updated));
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-white/50 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Button>
          )}
          <p className="text-sm text-gray-600 font-medium">Click cards to flip and view details</p>
        </div>

        {/* Top Left Info Panel */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-600">Child's Name</Label>
                  {isEditingName ? (
                    <form onSubmit={handleNameSubmit} className="flex gap-2">
                      <Input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="h-8"
                      />
                      <Button type="submit" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                        Save
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-gray-800">{editedName}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingName(true)}
                        className="h-8 px-3 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-600">Date of Birth</Label>
                  {isEditingBirthdate ? (
                    <form onSubmit={handleBirthdateSubmit} className="flex gap-2">
                      <Input
                        type="date"
                        value={editedBirthdate}
                        onChange={(e) => setEditedBirthdate(e.target.value)}
                        className="h-8"
                      />
                      <Button type="submit" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">
                        Save
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-gray-800">
                        {(() => {
                          const [year, month, day] = editedBirthdate.split('-').map(Number);
                          const birthDate = new Date(year, month - 1, day);
                          return birthDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });
                        })()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingBirthdate(true)}
                        className="h-8 px-3 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <Label className="text-sm text-gray-600">Age</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-gray-800">{currentAge}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={saveProfile}
                      className="h-8 px-3 text-xs bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-300 ripple-effect"
                      data-save-reading
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={deleteProfile}
                      className="h-8 px-3 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
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
              {editedName}'s energetic outlook for age {currentAge}
            </p>
          </CardHeader>
          <CardContent>
            {yearlyForecast && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* Birth Card */}
                <div className="text-center group">
                  <h4 className="font-semibold text-purple-800 text-sm">Birth Card</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(birthCard, 'birth')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.birth.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.birth.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.birth.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(birthCard) || '/placeholder.svg'}
                            alt={birthCard}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Long Range */}
                <div className="text-center group">
                  <h4 className="font-semibold text-blue-800 text-sm">Long Range</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(yearlyForecast.longRange, 'forecast')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.longRange.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.longRange.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.longRange.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(yearlyForecast.longRange) || '/placeholder.svg'}
                            alt={yearlyForecast.longRange}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pluto */}
                <div className="text-center group">
                  <h4 className="font-semibold text-red-800 text-sm">Pluto</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(yearlyForecast.pluto, 'forecast')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.pluto.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.pluto.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.pluto.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(yearlyForecast.pluto) || '/placeholder.svg'}
                            alt={yearlyForecast.pluto}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="text-center group">
                  <h4 className="font-semibold text-green-800 text-sm">Result</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(yearlyForecast.result, 'forecast')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.result.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.result.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.result.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(yearlyForecast.result) || '/placeholder.svg'}
                            alt={yearlyForecast.result}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="text-center group">
                  <h4 className="font-semibold text-yellow-800 text-sm">Support</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(yearlyForecast.support, 'forecast')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.support.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.support.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.support.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(yearlyForecast.support) || '/placeholder.svg'}
                            alt={yearlyForecast.support}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development */}
                <div className="text-center group">
                  <h4 className="font-semibold text-indigo-800 text-sm">Development</h4>
                  <div className="relative">
                    <div 
                      className="card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in"
                      onClick={() => handleCardClick(yearlyForecast.development, 'forecast')}
                    >
                      <div className="card-inner">
                        {/* Card Back */}
                        <div className="card-face card-face-back">
                          <div className="w-full h-full rounded-lg shadow-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                            <div className="absolute inset-y-2 inset-x-[15px] flex flex-col justify-center text-white text-center">
                              <h5 className="text-lg font-bold mb-1">{cardPositionDescriptions.development.title}</h5>
                              <p className="text-[17px] leading-tight mb-1">{cardPositionDescriptions.development.description}</p>
                              <p className="text-[17px] italic opacity-90">{cardPositionDescriptions.development.insights}</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Front */}
                        <div className="card-face card-face-front">
                          <img
                            src={getCardImage(yearlyForecast.development) || '/placeholder.svg'}
                            alt={yearlyForecast.development}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              {planetaryPeriods.map((period) => (
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
                      className={`w-full max-w-20 mx-auto mb-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in ${
                        period.planet === currentPlanetaryPeriod
                          ? 'ring-2 ring-purple-400 shadow-purple-200'
                          : ''
                      }`}
                      onClick={() => handleCardClick(period.card, 'forecast')}
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
          childName={editedName}
          birthCard={birthCard}
          currentAge={currentAge}
          yearlyForecast={yearlyForecast}
          planetaryPeriods={planetaryPeriods}
        />

        {/* Card Modal */}
        {selectedCard && (
          <CardModal
            card={selectedCard.card}
            type={selectedCard.type as 'birth' | 'forecast' | 'planetary'}
            isOpen={!!selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </div>
    </div>
  );
}
