'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBirthCardFromDate } from '@/utils/getBirthCardFromDate';

interface BirthCardLookupProps onBirthCardCalculated: (cardData: any, year: number, month: string, day: number) => void;
  onBirthCardClick: () => void;
  initialBirthdate?: string;

export default function BirthCardLookup({ onBirthCardCalculated, onBirthCardClick, initialBirthdate }: BirthCardLookupProps) const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [birthCard, setBirthCard] = useState<any>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => if (initialBirthdate) const date = new Date(initialBirthdate);
      setMonth(months[date.getMonth()]);
      setDay(date.getDate().toString());
      setYear(date.getFullYear().toString());, [initialBirthdate]);

  useEffect(() => if (month && day && year) calculateBirthCard();, [month, day, year]);

  const calculateBirthCard = () => if (!month || !day || !year) return;

    try const cardData = getBirthCardFromDate(parseInt(day), month, parseInt(year));
      setBirthCard(cardData);
      onBirthCardCalculated(cardData, parseInt(year), month, parseInt(day)); catch (error) console.error('Error calculating birth card:', error);;

  const getCardImage = (card: string) => if (!card) return '/placeholder.svg?height=200&width=140';
    return `/cards/${card}.png`;;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Birth Card Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="month">Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="day">Day</Label>
            <Input
              id="day"
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Day"
            />
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min="1900"
              max="2030"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
            />
          </div>
        </div>

        {birthCard && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src={getCardImage(birthCard.card) || "/placeholder.svg"}
                alt={`${birthCard.card} card`}
                className="w-32 h-44 object-contain cursor-pointer hover:scale-105 transition-transform"
                onClick={onBirthCardClick}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-800">{birthCard.card}</h3>
              <p className="text-blue-600">{birthCard.name}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
