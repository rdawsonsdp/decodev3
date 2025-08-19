'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SnowflakeIcon as Crystal, Calendar, Star } from 'lucide-react'
import { getYearlyForecast } from '@/utils/yearlyForecastLookup'
import { getCardImage } from '@/utils/getCardImage'

interface ForecastSpreadProps childName: string
  birthdate: string
  currentAge: number

export default function ForecastSpread({ childName, birthdate, currentAge }: ForecastSpreadProps) const currentYear = new Date().getFullYear()
  const forecast = getYearlyForecast(birthdate, currentAge)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {childName}'s Yearly Forecast
        </h2>
        <p className="text-gray-600">
          Insights for age {currentAge} ({currentYear})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crystal className="h-5 w-5 text-purple-500" />
              Long Range Card
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img
              src={getCardImage(forecast.longRangeCard) || "/placeholder.svg"}
              alt={`${forecast.longRangeCard} card`}
              className="w-24 h-36 mx-auto mb-3 rounded shadow-md"
            />
            <h3 className="font-semibold text-gray-900">{forecast.longRangeCard}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Overall theme for this year
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              Pluto Card
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img
              src={getCardImage(forecast.plutoCard) || "/placeholder.svg"}
              alt={`${forecast.plutoCard} card`}
              className="w-24 h-36 mx-auto mb-3 rounded shadow-md"
            />
            <h3 className="font-semibold text-gray-900">{forecast.plutoCard}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Transformation and growth
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              Result Card
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <img
              src={getCardImage(forecast.resultCard) || "/placeholder.svg"}
              alt={`${forecast.resultCard} card`}
              className="w-24 h-36 mx-auto mb-3 rounded shadow-md"
            />
            <h3 className="font-semibold text-gray-900">{forecast.resultCard}</h3>
            <p className="text-sm text-gray-600 mt-2">
              What this year brings
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Yearly Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Themes</h4>
              <p className="text-gray-700">
                This year emphasizes {forecast.themes.join(', ').toLowerCase()} for {childName}.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Opportunities</h4>
              <p className="text-gray-700">
                Look for chances to develop {forecast.opportunities.join(' and ')}.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Parenting Focus</h4>
              <p className="text-gray-700">
                Support {childName} by {forecast.parentingTips.join(' and ')}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
