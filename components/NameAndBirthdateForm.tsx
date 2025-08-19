'use client'

import React, { useState } from 'react'

interface NameAndBirthdateFormProps {
  onSubmit: (data: { name: string; birthdate: string }) => void
}

export default function NameAndBirthdateForm({ onSubmit }: NameAndBirthdateFormProps) {
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name, birthdate })
      }}
      className="space-y-4 p-4"
    >
      <div>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="birthdate" className="block mb-1">
          Birth Date
        </label>
        <input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="px-4 py-2 border">Submit</button>
    </form>
  )
}
