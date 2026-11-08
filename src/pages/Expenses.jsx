import React, { useState } from 'react'
import { CalendarDays, Pencil, Plus, Trash2, Wallet } from 'lucide-react'
import {
  EmptyState,
  PageHeading,
  RowActions,
  SearchBox
} from '../components/Common'
import { DateFilter } from '../components/DateFilter'
import {
  currentYearMonth,
  getFinanceRange,
  money,
  prettyDate
} from '../lib/utils'

export function Expenses({ data, setModal, loading, onDelete }) {
  const [filterPreset, setFilterPreset] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth())
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [search, setSearch] = useState('')

  const rangeInfo = getFinanceRange(
    filterPreset,
    customStart,
    customEnd,
    selectedMonth
  )
  const { start, end } = rangeInfo

  const periodExpenses = data.expenses.filter((e) => {
    if (start && e.expense_date < start) return false
    if (end && e.expense_date > end) return false
    return true
  })

  const filtered = periodExpenses.filter((e) =>
    `${e.description}`.toLowerCase().includes(search.toLowerCase())
  )

  const sum = periodExpenses.reduce(
    (s, e) => s + Number(e.amount || 0),
    0
  )

  return (
    <>
      <PageHeading
        eyebrow="EXPENSES"
        title="Expenses"
        description="Keep your clinic spending clear and under control with date & month filters."
      />

      <DateFilter
        filterPreset={filterPreset}
        setFilterPreset={setFilterPreset}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        customStart={customStart}
        setCustomStart={setCustomStart}
        customEnd={customEnd}
        setCustomEnd={setCustomEnd}
        rangeInfo={rangeInfo}
      />

      <div className="summary-strip">
        <div className="summary-label">
          <span>Total expenses · {rangeInfo.shortLabel}</span>
          <b>{money(sum)}</b>
        </div>
        <button
          className="primary-button"
          onClick={() => setModal('expense')}
        >
          <Plus size={16} />
          Add expense
        </button>
      </div>

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search expense description..."
        />
        <span className="result-count">
          {filtered.length} of {periodExpenses.length} records
        </span>
      </div>

      {/* Desktop Table View (visible on desktop, hidden on phone) */}
      <div className="panel table-panel desktop-table-panel">
        {filtered.length ? (
          <div className="desktop-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th className="align-right">Amount</th>
                  <th className="align-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <b>{e.description}</b>
                    </td>
                    <td>{prettyDate(e.expense_date)}</td>
                    <td className="align-right amount-cell">
                      {money(e.amount)}
                    </td>
                    <td>
                      <RowActions
                        label="expense"
                        onEdit={() =>
                          setModal({ type: 'expense', record: e })
                        }
                        onDelete={() => onDelete('expenses', e, 'expense')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Wallet}
            title={
              search
                ? 'No matching expenses'
                : 'No expenses in this period'
            }
            text={
              search
                ? 'Try a different search term or clear the search.'
                : `No expenses recorded for ${rangeInfo.label}. Click below to add one.`
            }
            action="Add expense"
            onAction={() => setModal('expense')}
          />
        )}
      </div>

      {/* Modern Phone / Mobile Card List (visible on phone, hidden on desktop) */}
      <div className="expense-mobile-list">
        {filtered.length ? (
          filtered.map((e) => (
            <div className="expense-card" key={e.id}>
              <div className="expense-card-left">
                <div className="expense-icon-wrap">
                  <Wallet size={19} />
                </div>
                <div className="expense-info">
                  <b className="expense-title">{e.description}</b>
                  <div className="expense-date">
                    <CalendarDays size={12} />
                    <span>{prettyDate(e.expense_date)}</span>
                  </div>
                </div>
              </div>

              <div className="expense-card-right">
                <b className="expense-amount">{money(e.amount)}</b>
                <div className="expense-actions">
                  <button
                    className="expense-action-btn"
                    title="Edit expense"
                    aria-label="Edit expense"
                    onClick={() => setModal({ type: 'expense', record: e })}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="expense-action-btn danger"
                    title="Delete expense"
                    aria-label="Delete expense"
                    onClick={() => onDelete('expenses', e, 'expense')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="panel" style={{ padding: '24px 16px' }}>
            <EmptyState
              icon={Wallet}
              title={
                search
                  ? 'No matching expenses'
                  : 'No expenses in this period'
              }
              text={
                search
                  ? 'Try a different search term or clear the search.'
                  : `No expenses recorded for ${rangeInfo.label}. Click below to add one.`
              }
              action="Add expense"
              onAction={() => setModal('expense')}
            />
          </div>
        )}
      </div>
    </>
  )
}
