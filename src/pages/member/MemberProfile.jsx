import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMemberSession } from '../../services/memberAuthService'
import { getMemberProfile, updateMemberProfile } from '../../services/memberProfileService'

const emptyProfile = { firstName: '', lastName: '', email: '', gender: '', educationDegree: '', phoneNumber: '' }
const toForm = (profile) => Object.fromEntries(Object.keys(emptyProfile).map((key) => [key, profile?.[key] ?? '']))
// These display values can be mapped to backend enums when its contract is supplied.
const dropdowns = [
  { name: 'gender', label: 'Gender', options: ['Female', 'Male', 'Non-binary', 'Other', 'Prefer not to say'] },
  { name: 'educationDegree', label: 'Education degree', options: ['High school', 'Vocational qualification', 'Associate degree', 'Bachelor’s degree', 'Master’s degree', 'Doctorate', 'Other'] },
]
const errorMessage = (error) => {
  const message = error.response?.data?.message || error.response?.data?.error || error.message
  return Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Unable to save your profile. Please try again.'
}

export default function MemberProfile() {
  const [form, setForm] = useState(() => toForm({ ...getMemberSession()?.profile, email: getMemberSession()?.email }))
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMemberProfile().then((profile) => {
      if (active) { setForm(toForm(profile)); setLoadFailed(false) }
    }).catch((err) => {
      if (active) { setError(errorMessage(err)); setLoadFailed(true) }
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  const change = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setError('')
    setSuccess('')
  }
  const submit = async (event) => {
    event.preventDefault()
    if (saving || loading || loadFailed) return
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('Please enter your first and last name.'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]))
      await updateMemberProfile(payload)
      setForm(payload)
      setSuccess('Your profile has been updated.')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }
  const inputClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60'

  return (
    <section className="container py-16">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-secondary font-semibold">PEN Club members</p>
          <h1>My profile</h1>
          <p className="text-gray-600">Manage your personal details and contact information.</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl shadow-sm">
        <h2 className="text-xl">Personal information</h2>
        <p className="text-sm text-gray-500">Gender, education degree, and phone number are optional.</p>
        {error && <p role="alert" className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{error}</p>}
        {loadFailed && <button type="button" className="text-secondary underline mb-4" onClick={() => setReload((value) => value + 1)}>Retry loading profile</button>}
        {success && <p role="status" className="bg-green-50 text-green-800 rounded-lg p-3 text-sm">{success}</p>}
        {loading && <p role="status">Loading your profile…</p>}
        <form onSubmit={submit} aria-busy={loading || saving}>
          <fieldset disabled={loading || saving || loadFailed} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {[['firstName', 'First name', 'given-name'], ['lastName', 'Last name', 'family-name']].map(([name, label, autoComplete]) => (
                <div key={name}>
                  <label htmlFor={`profile-${name}`} className="block text-sm font-semibold mb-2">{label}</label>
                  <input id={`profile-${name}`} name={name} value={form[name]} onChange={change} autoComplete={autoComplete} required className={inputClass} />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-semibold mb-2">Email</label>
              <input id="profile-email" name="email" type="email" autoComplete="email" value={form.email} onChange={change} required className={inputClass} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {dropdowns.map(({ name, label, options }) => (
                <div key={name}>
                  <label htmlFor={`profile-${name}`} className="block text-sm font-semibold mb-2">{label} <span className="font-normal text-gray-500">(optional)</span></label>
                  <select id={`profile-${name}`} name={name} value={form[name]} onChange={change} className={inputClass}>
                    <option value="">Not specified</option>
                    {form[name] && !options.includes(form[name]) && <option value={form[name]}>{form[name]}</option>}
                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-semibold mb-2">Phone number <span className="font-normal text-gray-500">(optional)</span></label>
              <input id="profile-phone" name="phoneNumber" type="tel" autoComplete="tel" value={form.phoneNumber} onChange={change} placeholder="e.g. +48 123 456 789" className={inputClass} />
            </div>
            <button type="submit" disabled={saving || loading || loadFailed} className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary">{saving ? 'Saving…' : 'Save changes'}</button>
          </fieldset>
        </form>
      </div>
      <Link to="/events" className="inline-block mt-6 text-secondary font-semibold hover:underline">Explore events</Link>
    </section>
  )
}
