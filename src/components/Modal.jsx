import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, eyebrow = 'CLINIC RECORD', onClose, children }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h2>{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
