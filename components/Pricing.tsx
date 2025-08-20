'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Sparkles, Zap } from 'lucide-react'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  )

  const plans = [
    {
      name: 'Free',
      description: 'Basic birth card insights for curious parents',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Birth card identification',
        'Basic personality insights',
        'Limited AI chat questions',
        '1 child profile',
      ],
      cta: 'Get Started',
      popular: false,
      icon: Star,
    },
    {
      name: 'Premium',
      description: "Complete cosmic blueprint for your child's journey",
      price: { monthly: 9.99, yearly: 99.99 },
      features: [
        'Everything in Free',
        'Yearly forecast spreads',
        'Planetary period insights',
        'Unlimited AI chat questions',
        'Up to 5 child profiles',
        'Wisdom vault storage',
        'Journey tracker',
      ],
      cta: 'Start Premium',
      popular: true,
      icon: Sparkles,
    },
    {
      name: 'Family',
      description: 'Multiple children and advanced insights',
      price: { monthly: 19.99, yearly: 199.99 },
      features: [
        'Everything in Premium',
        'Unlimited child profiles',
        'Relationship compatibility',
        'Advanced parenting strategies',
        'Priority support',
        'Custom PDF reports',
      ],
      cta: 'Start Family Plan',
      popular: false,
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}
            className={
              billingCycle === 'monthly' ? 'bg-white shadow-sm' : ''
            }
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('yearly')}
            className={billingCycle === 'yearly' ? 'bg-white shadow-sm' : ''}
          >
            Yearly
            <Badge
              variant="outline"
              className="ml-2 bg-green-50 text-green-700 border-green-200"
            >
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`shadow-lg ${
              plan.popular
                ? 'border-purple-200 shadow-purple-100 relative'
                : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${
                    plan.popular ? 'bg-purple-100' : 'bg-gray-100'
                  }`}
                >
                  <plan.icon
                    className={`h-5 w-5 ${
                      plan.popular ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-3xl font-bold">
                  ${plan.price[billingCycle].toFixed(2)}
                  <span className="text-sm font-normal text-gray-500">
                    {plan.price[billingCycle] > 0
                      ? `/${billingCycle === 'monthly' ? 'mo' : 'yr'}`
                      : ''}
                  </span>
                </p>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  )
}