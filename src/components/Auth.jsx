import React, { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Brand, Field } from './Common'

export function SetupScreen() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Brand />
        <div className="auth-heading">
          <h1>Connect your clinic</h1>
          <p>Add your Supabase project details to get started.</p>
        </div>
        <div className="setup-steps">
          <div>
            <b>1</b>
            <span>Open your project in Supabase</span>
          </div>
          <div>
            <b>2</b>
            <span>Go to Project Settings → API</span>
          </div>
          <div>
            <b>3</b>
            <span>Copy the Project URL and publishable key</span>
          </div>
          <div>
            <b>4</b>
            <span>
              Paste them into your <code>.env.local</code> file
            </span>
          </div>
        </div>
        <div className="code-hint">
          VITE_SUPABASE_URL=...
          <br />
          VITE_SUPABASE_ANON_KEY=...
        </div>
        <p className="auth-foot">Restart your development server after saving the file.</p>
      </div>
    </div>
  )
}

export function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) setError(error.message)
    else onLogin(data.session)
    setBusy(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Brand />
        <div className="auth-heading">
          <div className="eyebrow">WELCOME BACK</div>
          <h1>Your clinic, in good hands.</h1>
          <p>Sign in to manage your patients, visits and daily collections.</p>
        </div>
        <form onSubmit={submit} className="form-stack">
          <Field label="Email address">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </Field>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="auth-foot">
          <ShieldCheck size={15} /> Private access for your clinic
        </div>
      </div>
    </div>
  )
}
