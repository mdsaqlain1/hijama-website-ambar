import React, { useState } from 'react'
import {
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  X
} from 'lucide-react'
import {
  currentYearMonth,
  formatMonthName,
  shiftYearMonth
} from '../lib/utils'

export function DateFilter({
  filterPreset,
  setFilterPreset,
  selectedMonth,
  setSelectedMonth,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  rangeInfo
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [tempPreset, setTempPreset] = useState('month')
  const [tempMonth, setTempMonth] = useState(currentYearMonth())
  const [tempStart, setTempStart] = useState('')
  const [tempEnd, setTempEnd] = useState('')

  const openMobileFilter = () => {
    setTempPreset(filterPreset)
    setTempMonth(selectedMonth)
    setTempStart(customStart)
    setTempEnd(customEnd)
    setMobileFilterOpen(true)
  }

  const applyMobileFilter = () => {
    setFilterPreset(tempPreset)
    setSelectedMonth(tempMonth)
    setCustomStart(tempStart)
    setCustomEnd(tempEnd)
    setMobileFilterOpen(false)
  }

  return (
    <>
      {/* 1. DESKTOP / LAPTOP FILTER BAR */}
      <div className="finance-filter-panel desktop-only-filter">
        <div className="filter-header">
          <div className="filter-title">
            <Filter size={15} />
            <span>FILTER BY DATE & PERIOD</span>
          </div>
          <div className="filter-active-pill">
            <CalendarDays size={13} />
            <span>{rangeInfo.label}</span>
          </div>
        </div>

        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'month' ? 'active' : ''}`}
            onClick={() => setFilterPreset('month')}
          >
            This Month
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'today' ? 'active' : ''}`}
            onClick={() => setFilterPreset('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'week' ? 'active' : ''}`}
            onClick={() => setFilterPreset('week')}
          >
            This Week
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'last_month' ? 'active' : ''}`}
            onClick={() => setFilterPreset('last_month')}
          >
            Last Month
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'year' ? 'active' : ''}`}
            onClick={() => setFilterPreset('year')}
          >
            This Year
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'by_month' ? 'active' : ''}`}
            onClick={() => setFilterPreset('by_month')}
          >
            <Calendar size={13} />
            Select Month
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'custom' ? 'active' : ''}`}
            onClick={() => setFilterPreset('custom')}
          >
            Custom Range
          </button>
          <button
            type="button"
            className={`filter-chip ${filterPreset === 'all' ? 'active' : ''}`}
            onClick={() => setFilterPreset('all')}
          >
            All Time
          </button>

          {filterPreset !== 'month' && (
            <button
              type="button"
              className="filter-reset-btn"
              onClick={() => {
                setFilterPreset('month')
                setSelectedMonth(currentYearMonth())
                setCustomStart('')
                setCustomEnd('')
              }}
            >
              <RotateCcw size={12} />
              Reset to this month
            </button>
          )}
        </div>

        {filterPreset === 'by_month' && (
          <div className="filter-custom-row">
            <div className="filter-date-field">
              <span>Choose Month:</span>
              <div className="month-nav-controls">
                <button
                  type="button"
                  className="month-nav-btn"
                  title="Previous month"
                  onClick={() => setSelectedMonth((m) => shiftYearMonth(m, -1))}
                >
                  <ChevronLeft size={16} />
                </button>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
                <button
                  type="button"
                  className="month-nav-btn"
                  title="Next month"
                  onClick={() => setSelectedMonth((m) => shiftYearMonth(m, 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <span className="result-count">
              Viewing {formatMonthName(selectedMonth)}
            </span>
          </div>
        )}

        {filterPreset === 'custom' && (
          <div className="filter-custom-row">
            <div className="filter-date-field">
              <span>From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
            </div>
            <div className="filter-date-field">
              <span>To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. PHONE / MOBILE FILTER TRIGGER BUTTON */}
      <div className="mobile-filter-container">
        <button
          type="button"
          className="mobile-filter-trigger-btn"
          onClick={openMobileFilter}
        >
          <div className="mobile-filter-btn-content">
            <div className="mobile-filter-icon-badge">
              <Filter size={15} />
            </div>
            <div className="mobile-filter-text">
              <span className="mobile-filter-caption">Active Filter:</span>
              <b className="mobile-filter-applied-name">
                {rangeInfo.shortLabel}
              </b>
            </div>
          </div>
          <div className="mobile-filter-arrow">
            <ChevronDown size={16} />
          </div>
        </button>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div
          className="modal-backdrop mobile-filter-backdrop"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="mobile-filter-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-filter-sheet-header">
              <div className="filter-title">
                <Filter size={16} />
                <span>SELECT DATE OR MONTH FILTER</span>
              </div>
              <button
                className="icon-button"
                style={{ width: 30, height: 30 }}
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mobile-filter-sheet-body">
              <div className="mobile-filter-options-grid">
                {[
                  { id: 'month', label: 'This Month' },
                  { id: 'today', label: 'Today' },
                  { id: 'week', label: 'This Week' },
                  { id: 'last_month', label: 'Last Month' },
                  { id: 'year', label: 'This Year' },
                  { id: 'by_month', label: 'Select Month' },
                  { id: 'custom', label: 'Custom Range' },
                  { id: 'all', label: 'All Time' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`mobile-filter-option-btn ${
                      tempPreset === opt.id ? 'active' : ''
                    }`}
                    onClick={() => setTempPreset(opt.id)}
                  >
                    <span>{opt.label}</span>
                    {tempPreset === opt.id && <Check size={15} />}
                  </button>
                ))}
              </div>

              {tempPreset === 'by_month' && (
                <div className="mobile-filter-subbox">
                  <span className="mobile-filter-subbox-title">
                    Choose Specific Month
                  </span>
                  <div className="month-nav-controls" style={{ width: '100%' }}>
                    <button
                      type="button"
                      className="month-nav-btn"
                      onClick={() => setTempMonth((m) => shiftYearMonth(m, -1))}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <input
                      type="month"
                      value={tempMonth}
                      onChange={(e) => setTempMonth(e.target.value)}
                      style={{ flex: 1, textAlign: 'center' }}
                    />
                    <button
                      type="button"
                      className="month-nav-btn"
                      onClick={() => setTempMonth((m) => shiftYearMonth(m, 1))}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <small
                    style={{
                      color: '#7a8e83',
                      marginTop: 4,
                      display: 'block'
                    }}
                  >
                    Selected: {formatMonthName(tempMonth)}
                  </small>
                </div>
              )}

              {tempPreset === 'custom' && (
                <div className="mobile-filter-subbox">
                  <span className="mobile-filter-subbox-title">
                    Choose Date Range
                  </span>
                  <div className="form-stack" style={{ gap: 10 }}>
                    <div
                      className="filter-date-field"
                      style={{ justifyContent: 'space-between' }}
                    >
                      <span>From Date:</span>
                      <input
                        type="date"
                        value={tempStart}
                        onChange={(e) => setTempStart(e.target.value)}
                      />
                    </div>
                    <div
                      className="filter-date-field"
                      style={{ justifyContent: 'space-between' }}
                    >
                      <span>To Date:</span>
                      <input
                        type="date"
                        value={tempEnd}
                        onChange={(e) => setTempEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mobile-filter-sheet-footer">
              <button
                type="button"
                className="secondary-button"
                style={{ flex: 1 }}
                onClick={() => {
                  setTempPreset('month')
                  setTempMonth(currentYearMonth())
                  setTempStart('')
                  setTempEnd('')
                }}
              >
                Reset
              </button>
              <button
                type="button"
                className="primary-button"
                style={{ flex: 2 }}
                onClick={applyMobileFilter}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
