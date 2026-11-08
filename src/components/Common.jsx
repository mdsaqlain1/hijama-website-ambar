import React from 'react'
import {
  CalendarDays,
  Droplets,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  X
} from 'lucide-react'
import { money, prettyDate, initials } from '../lib/utils'

export function Brand({ compact = false }) {
  return (
    <div className={compact ? 'brand compact' : 'brand'}>
      <div className="brand-mark">
        <Droplets size={21} strokeWidth={2.5} />
      </div>
      <div className="brand-name">
        hijama<span>care</span>
        <small>CLINIC MANAGER</small>
      </div>
    </div>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
  actionLabel = 'Add new',
  onAction
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {/* <p>{description}</p> */}
      </div>
      {onAction && (
        <button className="primary-button heading-action" onClick={onAction}>
          <Plus size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, tone = 'green', note, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className={`stat-icon ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">
        {trend && (
          <span className="trend">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}
        {note}
      </div>
    </div>
  )
}

export function SectionTitle({ title, link, onClick }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {link && (
        <button onClick={onClick}>
          {link}
          <span style={{ marginLeft: 4 }}>→</span>
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  text,
  action,
  onAction
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={22} />
      </div>
      <b>{title}</b>
      <p>{text}</p>
      {action && (
        <button className="text-action" onClick={onAction}>
          <Plus size={15} />
          {action}
        </button>
      )}
    </div>
  )
}

export function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-box">
      <Search size={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange('')}>
          <X size={15} />
        </button>
      )}
    </div>
  )
}

export function RowActions({ onEdit, onDelete, label = 'record' }) {
  return (
    <div className="row-actions">
      <button
        className="action-button"
        title={`Edit ${label}`}
        aria-label={`Edit ${label}`}
        onClick={onEdit}
      >
        <Pencil size={15} />
      </button>
      <button
        className="action-button danger"
        title={`Delete ${label}`}
        aria-label={`Delete ${label}`}
        onClick={onDelete}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export function VisitTable({ visits, loading, emptyAction, setModal, onDelete }) {
  return (
    <>
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Cups</th>
              <th>Payment</th>
              <th className="align-right">Fees</th>
              <th className="align-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>
                  <div className="person-cell">
                    <div className="avatar avatar-soft">
                      {initials(v.patients?.name || 'Patient')}
                    </div>
                    <b>{v.patients?.name || 'Patient'}</b>
                  </div>
                </td>
                <td>{prettyDate(v.visit_date)}</td>
                <td>{v.cups_used}</td>
                <td>
                  <span className="payment-pill">{v.payment_method}</span>
                </td>
                <td className="align-right amount-cell">{money(v.fee)}</td>
                <td>
                  <RowActions
                    label="visit"
                    onEdit={() => setModal({ type: 'visit', record: v })}
                    onDelete={() => onDelete('visits', v, 'visit')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-list">
        {visits.map((v) => (
          <div className="mobile-row visit-mobile" key={v.id}>
            <div className="avatar avatar-soft">
              {initials(v.patients?.name || 'Patient')}
            </div>
            <div className="mobile-row-main">
              <b>{v.patients?.name || 'Patient'}</b>
              <span>
                {prettyDate(v.visit_date)} · {v.cups_used} cups · {v.payment_method}
              </span>
              <b className="mobile-amount">{money(v.fee)}</b>
            </div>
            <RowActions
              label="visit"
              onEdit={() => setModal({ type: 'visit', record: v })}
              onDelete={() => onDelete('visits', v, 'visit')}
            />
          </div>
        ))}
      </div>

      {loading && <div className="loading-line">Loading visits…</div>}
      {!loading && !visits.length && (
        <EmptyState
          icon={CalendarDays}
          title="No visits recorded"
          text="Your patient visits will appear here."
          action="Record a visit"
          onAction={emptyAction}
        />
      )}
    </>
  )
}

export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}
