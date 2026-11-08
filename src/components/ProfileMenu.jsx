import React from 'react'
import { LogOut, ShieldCheck } from 'lucide-react'
import { initials } from '../lib/utils'

export function ProfileMenu({ session, isOpen, onClose, onSignOut }) {
  if (!isOpen) return null

  const userEmail = session?.user?.email || 'user@example.com'
  const username = userEmail.split('@')[0]

  return (
    <div className="profile-dropdown">
      <div className="profile-dropdown-header">
        <div className="avatar avatar-dark">{initials(userEmail)}</div>
        <div className="profile-dropdown-user">
          <b>{username}</b>
          <span>{userEmail}</span>
        </div>
      </div>

      <div className="profile-dropdown-badge">
        <ShieldCheck size={14} />
        <span>Clinic Administrator</span>
      </div>

      <div className="profile-dropdown-divider" />

      <button
        className="profile-dropdown-item danger"
        onClick={() => {
          onClose()
          onSignOut()
        }}
      >
        <LogOut size={16} />
        <span>Sign out</span>
      </button>
    </div>
  )
}
