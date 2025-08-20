'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar, User, Save, Trash2, ChevronDown } from 'lucide-react'

interface NameAndBirthdateFormProps {
  onSubmit: (data: { name: string; birthdate: string }) => void
}

export default function NameAndBirthdateForm({
  onSubmit,
}: NameAndBirthdateFormProps) {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [savedProfiles, setSavedProfiles] = useState<
    { name: string; birthdate: string }[]
  >([])

  useEffect(() => {
    const stored = localStorage.getItem('savedReadings')
    if (stored) {
      setSavedProfiles(JSON.parse(stored))
    }
  }, [])

  const saveProfile = () => {
    if (!name || !birthdate) {
      alert('Please enter both name and birthdate')
      return
    }

    const newProfile = { name, birthdate }
    const updatedProfiles = [...savedProfiles, newProfile]
    setSavedProfiles(updatedProfiles)
    localStorage.setItem('savedReadings', JSON.stringify(updatedProfiles))
    alert('Profile saved!')
  }

  const deleteProfile = () => {
    if (!name || !birthdate) {
      alert('Please select a profile to delete')
      return
    }

    const updatedProfiles = savedProfiles.filter(
      (p) => !(p.name === name && p.birthdate === birthdate)
    )
    setSavedProfiles(updatedProfiles)
    localStorage.setItem('savedReadings', JSON.stringify(updatedProfiles))
    setName('')
    setBirthdate('')
    alert('Profile deleted!')
  }

  const handleSelectSaved = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [savedName, savedDate] = e.target.value.split('||')
    setName(savedName)
    setBirthdate(savedDate)
    onSubmit({ name: savedName, birthdate: savedDate })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, birthdate }) // trigger correct DOB carry-over
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-black text-center mb-2">
            Enter Your Child's Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="saved" className="block text-black mb-1">
                Saved Readings
              </Label>
              <select
                id="saved"
                onChange={handleSelectSaved}
                className="w-full border rounded px-3 py-2 text-black"
                defaultValue=""
              >
                <option disabled value="">
                  -- Select Saved Profile --
                </option>
                {savedProfiles.map((profile, idx) => (
                  <option
                    key={idx}
                    value={profile.name + '||' + profile.birthdate}
                  >
                    {profile.name} ({profile.birthdate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter child's name"
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="text-black"
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Reveal Birth Card Magic
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={saveProfile}
                >
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={deleteProfile}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
