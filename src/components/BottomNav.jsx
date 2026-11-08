import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  Ellipsis,
  Home,
  Package,
  Settings,
  Users,
  Wallet,
  X
} from 'lucide-react'

// The 4 main tabs visible directly in the bottom navigation bar
const MAIN_BOTTOM_NAV = [
  { id: 'dashboard', path: '/dashboard', label: 'Home', icon: Home },
  { id: 'patients', path: '/patients', label: 'Patients', icon: Users },
  { id: 'visits', path: '/visits', label: 'Visits', icon: CalendarDays },
  { id: 'expenses', path: '/expenses', label: 'Expenses', icon: Wallet }
]

// Only the items NOT shown in the bottom bar
const MORE_ITEMS = [
  { id: 'stock', path: '/stock', label: 'Cup stock', icon: Package, desc: 'Supplies & inventory' },
  { id: 'reports', path: '/reports', label: 'Reports', icon: BarChart3, desc: 'Monthly summary & stats' }
]

export function BottomNav({ session, onOpenSettings }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isMoreActive = MORE_ITEMS.some((item) =>
    location.pathname.startsWith(item.path)
  )

  const handleSelectMoreItem = (path) => {
    setMoreOpen(false)
    navigate(path)
  }

  return (
    <>
      {moreOpen && (
        <div
          className="more-backdrop"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="more-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="more-sheet-header">
              <span className="eyebrow">MORE OPTIONS</span>
              <button
                className="icon-button"
                style={{ width: 28, height: 28 }}
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="more-sheet-list">
              {/* Only not shown navigation fields */}
              {MORE_ITEMS.map((item) => {
                const Icon = item.icon
                const active = location.pathname.startsWith(item.path)
                return (
                  <button
                    key={item.id}
                    className={`more-sheet-item ${active ? 'active' : ''}`}
                    onClick={() => handleSelectMoreItem(item.path)}
                  >
                    <div className="more-item-icon">
                      <Icon size={19} />
                    </div>
                    <div className="more-item-text">
                      <b>{item.label}</b>
                      <small>{item.desc}</small>
                    </div>
                  </button>
                )
              })}

              <div className="more-sheet-divider" />

              {/* Settings button to change email and password */}
              <button
                className="more-sheet-item"
                onClick={() => {
                  setMoreOpen(false)
                  onOpenSettings()
                }}
              >
                <div className="more-item-icon">
                  <Settings size={19} />
                </div>
                <div className="more-item-text">
                  <b>Settings</b>
                  <small>Change email & password</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        {MAIN_BOTTOM_NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `bottom-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}

        <button
          className={`bottom-item ${isMoreActive || moreOpen ? 'active' : ''}`}
          onClick={() => setMoreOpen(!moreOpen)}
          aria-label="More menu"
        >
          <Ellipsis size={21} />
          <span>More</span>
        </button>
      </nav>
    </>
  )
}
