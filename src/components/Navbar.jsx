import React, { useEffect, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Brand } from './Common'
import { ProfileMenu } from './ProfileMenu'
import { initials } from '../lib/utils'

export function Navbar({ currentLabel, session, onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileContainerRef = useRef(null)
  const userEmail = session?.user?.email || ''

  useEffect(() => {
    if (!profileOpen) return

    function handlePointerDown(e) {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(e.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [profileOpen])

  return (
    <header className="topbar">
      <div className="mobile-brand">
        <Brand compact />
      </div>

      <div className="crumb">
        <span>Workspace</span>
        <span className="crumb-slash">/</span>
        <b>{currentLabel}</b>
      </div>

      <div className="top-actions">
        <span className="today-chip">
          <CalendarDays size={15} />
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </span>

        {/* Profile Avatar Trigger & Menu Container */}
        <div ref={profileContainerRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="avatar-button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="User profile and settings"
            title="Profile"
            aria-expanded={profileOpen}
          >
            <div className="avatar">{initials(userEmail)}</div>
          </button>

          <ProfileMenu
            session={session}
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </header>
  )
}
