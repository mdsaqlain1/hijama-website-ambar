import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  Home,
  Package,
  Settings,
  ShieldCheck,
  Users,
  Wallet
} from 'lucide-react'
import { Brand } from './Common'
import { initials } from '../lib/utils'

export const NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Overview', icon: Home },
  { id: 'patients', path: '/patients', label: 'Patients', icon: Users },
  { id: 'visits', path: '/visits', label: 'Visits', icon: CalendarDays },
  { id: 'expenses', path: '/expenses', label: 'Expenses', icon: Wallet },
  { id: 'stock', path: '/stock', label: 'Cup stock', icon: Package },
  { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart3 }
]

export function Sidebar({ session, onOpenSettings }) {
  const userEmail = session?.user?.email || ''
  const username = userEmail.split('@')[0]

  return (
    <aside className="sidebar">
      <Brand />
      <div className="workspace-label">WORKSPACE</div>

      <nav className="side-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `nav-button ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} />
                  <span>{item.label}</span>
                  {isActive && <span className="nav-indicator" />}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="secure-note">
          <ShieldCheck size={17} />
          <span>Your clinic data is private</span>
        </div>

        <button
          className="profile-mini"
          onClick={onOpenSettings}
          title="Account & Security Settings"
          aria-label="Account & Security Settings"
        >
          <div className="avatar avatar-dark">{initials(userEmail)}</div>
          <div className="profile-copy">
            <b>{username}</b>
            <span>Settings & Profile</span>
          </div>
          <Settings size={18} />
        </button>
      </div>
    </aside>
  )
}
