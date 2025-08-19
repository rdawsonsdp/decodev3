'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Star, Calendar, Trash2 } from 'lucide-react'
import { getCardImage } from '@/utils/getCardImage'

interface WisdomVaultProps childName: string

interface VaultEntry card: string
  type: string
  profile: name: string
    description: string
  timestamp: string

export default function WisdomVault({ childName }: WisdomVaultProps) const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([])
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => // Load entries from localStorage
    const loadEntries = () => const entries: VaultEntry[] = []
      for (let i = 0; i < localStorage.length; i++) const key = localStorage.key(i)
        if (key && key.startsWith('wisdom-vault-')) try const entry = JSON.parse(localStorage.getItem(key) || '')
            entries.push(...entry,
              key) catch (e) console.error('Error parsing vault entry:', e)
      return entries.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

    setVaultEntries(loadEntries()), [])

  const deleteEntry = (key: string) => localStorage.removeItem(key)
    setVaultEntries(prev => prev.filter(entry => entry.key !== key))

  const filteredEntries = activeTab === 'all' 
    ? vaultEntries 
    : vaultEntries.filter(entry => entry.type === activeTab)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {childName}'s Wisdom Vault
        </h2>
        <p className="text-gray-600">
          Your collection of saved card insights and wisdom
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="birth" className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            Birth
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="planetary" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Planetary
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                {activeTab === 'all' ? 'All Saved Insights' : 
                 activeTab === 'birth' ? 'Birth Card Insights' :
                 activeTab === 'forecast' ? 'Forecast Card Insights' : 'Planetary Card Insights'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No saved insights yet.</p>
                  <p className="text-sm mt-2">Click "Save to Wisdom Vault" on any card to add it here.</p>
                </div>
              ) : (
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-6">
                    {filteredEntries.map((entry, index) => (
                      <Card key={index} className="p-4 shadow-md">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img 
                              src={getCardImage(entry.card) || "/placeholder.svg"} 
                              alt={entry.card}
                              className="w-16 h-24 rounded-md shadow-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-purple-800">{entry.profile.name}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteEntry(entry.key)}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              Saved on {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString()}
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {entry.profile.description.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
