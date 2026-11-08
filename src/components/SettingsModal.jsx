import React, { useState } from 'react'
import { ArrowRight, Check, KeyRound, Mail, ShieldAlert } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Modal } from './Modal'
import { Field } from './Common'

export function SettingsModal({ session, onClose, notify }) {
  const [activeTab, setActiveTab] = useState('account') // 'account' | 'security'
  const [email, setEmail] = useState(session?.user?.email || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' })

  async function handleUpdateEmail(e) {
    e.preventDefault()
    if (!email || email === session?.user?.email) {
      setStatusMessage({ text: 'Please enter a new email address.', type: 'error' })
      return
    }
    setBusy(true)
    setStatusMessage({ text: '', type: '' })
    try {
      const { data, error } = await supabase.auth.updateUser({ email })
      if (error) {
        setStatusMessage({ text: error.message, type: 'error' })
      } else {
        setStatusMessage({
          text: 'Confirmation link sent! Please check your new email to confirm.',
          type: 'success'
        })
        notify('Email update initiated. Check your inbox.')
      }
    } catch (err) {
      setStatusMessage({ text: err.message || 'Failed to update email.', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setStatusMessage({ text: 'Password must be at least 6 characters.', type: 'error' })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ text: 'Passwords do not match.', type: 'error' })
      return
    }
    setBusy(true)
    setStatusMessage({ text: '', type: '' })
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setStatusMessage({ text: error.message, type: 'error' })
      } else {
        setStatusMessage({
          text: 'Password updated successfully!',
          type: 'success'
        })
        setNewPassword('')
        setConfirmPassword('')
        notify('Password updated successfully.')
      }
    } catch (err) {
      setStatusMessage({ text: err.message || 'Failed to update password.', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Clinic Settings" eyebrow="ACCOUNT & SECURITY" onClose={onClose}>
      <div className="fin-subnav" style={{ marginBottom: 18 }}>
        <button
          type="button"
          className={`fin-subnav-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('account')
            setStatusMessage({ text: '', type: '' })
          }}
        >
          <Mail size={15} />
          <span>Change Email</span>
        </button>
        <button
          type="button"
          className={`fin-subnav-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('security')
            setStatusMessage({ text: '', type: '' })
          }}
        >
          <KeyRound size={15} />
          <span>Change Password</span>
        </button>
      </div>

      {statusMessage.text && (
        <div
          className={
            statusMessage.type === 'success'
              ? 'form-success-banner'
              : 'form-error'
          }
          style={{ marginBottom: 16 }}
        >
          {statusMessage.type === 'success' ? (
            <Check size={16} />
          ) : (
            <ShieldAlert size={16} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {activeTab === 'account' ? (
        <form onSubmit={handleUpdateEmail} className="form-stack">
          <div className="settings-current-info">
            <span>Current email address:</span>
            <b>{session?.user?.email || '—'}</b>
          </div>

          <Field label="New email address" hint="Supabase will send a verification link to confirm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter new email address"
              required
              autoComplete="email"
            />
          </Field>

          <div className="modal-actions" style={{ marginTop: 8 }}>
            <button className="primary-button" disabled={busy}>
              {busy ? 'Updating email…' : 'Update Email'}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleUpdatePassword} className="form-stack">
          <Field label="New password" hint="Minimum 6 characters">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              autoComplete="new-password"
            />
          </Field>

          <Field label="Confirm new password">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              autoComplete="new-password"
            />
          </Field>

          <div className="modal-actions" style={{ marginTop: 8 }}>
            <button className="primary-button" disabled={busy}>
              {busy ? 'Updating password…' : 'Update Password'}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
