import React, { useState } from 'react'
import {
  Activity,
  BarChart3,
  CalendarDays,
  Droplets,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react'
import { PageHeading, SectionTitle, StatCard } from '../components/Common'
import { DateFilter } from '../components/DateFilter'
import {
  currentYearMonth,
  formatMonthName,
  getFinanceRange,
  money,
  shiftYearMonth,
  toLocalISO
} from '../lib/utils'

export function Reports({ data }) {
  const [filterPreset, setFilterPreset] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth())
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const rangeInfo = getFinanceRange(
    filterPreset,
    customStart,
    customEnd,
    selectedMonth
  )
  const { start, end } = rangeInfo

  // Filter visits and expenses according to selected period
  const periodVisits = data.visits.filter((v) => {
    if (start && v.visit_date < start) return false
    if (end && v.visit_date > end) return false
    return true
  })

  const periodExpenses = data.expenses.filter((e) => {
    if (start && e.expense_date < start) return false
    if (end && e.expense_date > end) return false
    return true
  })

  const totalRevenue = periodVisits.reduce(
    (sum, v) => sum + Number(v.fee || 0),
    0
  )
  const totalExpenses = periodExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  )
  const netProfit = totalRevenue - totalExpenses
  const profitMargin =
    totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  const cashRevenue = periodVisits
    .filter((v) => v.payment_method === 'Cash')
    .reduce((sum, v) => sum + Number(v.fee || 0), 0)
  const onlineRevenue = periodVisits
    .filter((v) => v.payment_method === 'Online')
    .reduce((sum, v) => sum + Number(v.fee || 0), 0)

  const cupsUsed = periodVisits.reduce(
    (sum, v) => sum + Number(v.cups_used || 0),
    0
  )
  const avgFee =
    periodVisits.length > 0 ? totalRevenue / periodVisits.length : 0
  const avgProfit =
    periodVisits.length > 0 ? netProfit / periodVisits.length : 0

  const totalFlow = totalRevenue + totalExpenses
  const revenueRatio =
    totalFlow > 0 ? (totalRevenue / totalFlow) * 100 : 50

  // Recent 6 months profit summary
  const recentMonths = Array.from({ length: 6 }, (_, i) => {
    const ym = shiftYearMonth(currentYearMonth(), -i)
    const [y, m] = ym.split('-').map(Number)
    const s = `${ym}-01`
    const e = toLocalISO(new Date(y, m, 0))
    const mVisits = data.visits.filter(
      (v) => v.visit_date >= s && v.visit_date <= e
    )
    const mExpenses = data.expenses.filter(
      (ex) => ex.expense_date >= s && ex.expense_date <= e
    )
    const rev = mVisits.reduce((sum, v) => sum + Number(v.fee || 0), 0)
    const exp = mExpenses.reduce((sum, ex) => sum + Number(ex.amount || 0), 0)
    const profit = rev - exp
    const margin = rev > 0 ? (profit / rev) * 100 : 0
    return {
      ym,
      label: formatMonthName(ym),
      visitsCount: mVisits.length,
      revenue: rev,
      expenses: exp,
      profit,
      margin
    }
  })

  return (
    <>
      <PageHeading
        eyebrow="CLINICAL & FINANCIAL REPORTS"
        title="Reports & Profit"
        description="Comprehensive profit overview, revenue analysis, and clinic performance with date filters."
      />

      {/* Date & Period Filter Bar */}
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

      {/* Net Profit Highlight Banner */}
      <div
        className={
          netProfit >= 0
            ? 'report-highlight'
            : 'report-highlight loss-highlight'
        }
      >
        <div>
          <span>NET PROFIT · {rangeInfo.label.toUpperCase()}</span>
          <strong>{money(netProfit)}</strong>
          <small>
            {netProfit >= 0
              ? `Revenue after recorded expenses (${profitMargin.toFixed(1)}% profit margin)`
              : `Expenses exceed clinic revenue by ${money(Math.abs(netProfit))} for this period`}
          </small>
        </div>
        <div className="report-highlight-icon">
          {netProfit >= 0 ? <TrendingUp size={27} /> : <TrendingDown size={27} />}
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="stats-grid">
        <StatCard
          label="Net profit"
          value={money(netProfit)}
          icon={IndianRupee}
          tone={netProfit >= 0 ? 'green' : 'peach'}
          note={
            netProfit >= 0
              ? `${profitMargin.toFixed(1)}% profit margin`
              : 'Net loss in period'
          }
        />
        <StatCard
          label="Profit margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Activity}
          tone="blue"
          note="Of total revenue retained"
        />
        <StatCard
          label="Total revenue"
          value={money(totalRevenue)}
          icon={TrendingUp}
          tone="green"
          note={`${periodVisits.length} visits in period`}
        />
        <StatCard
          label="Total expenses"
          value={money(totalExpenses)}
          icon={Wallet}
          tone="peach"
          note={`${periodExpenses.length} records in period`}
        />
      </div>

      {/* Profit Breakdown & Balance Ratio */}
      <div className="report-grid">
        {/* Profit & Loss Calculation Panel */}
        <section className="panel profit-calculation">
          <SectionTitle title="Profit & Loss calculation" />
          <p className="panel-subtitle">
            Financial summary for {rangeInfo.label}
          </p>

          <div className="activity-stat">
            <span>Total clinic revenue</span>
            <b>{money(totalRevenue)}</b>
          </div>
          <div className="activity-stat">
            <span>Total clinic expenses</span>
            <b className="expense-value">− {money(totalExpenses)}</b>
          </div>

          <div className="profit-divider" />

          <div className="activity-stat final-profit">
            <span>Net profit</span>
            <b className={netProfit >= 0 ? 'profit-value' : 'expense-value'}>
              {money(netProfit)}
            </b>
          </div>

          <div className="activity-stat">
            <span>Average collection / visit</span>
            <b>{money(avgFee)}</b>
          </div>
          <div className="activity-stat">
            <span>Average profit / visit</span>
            <b className={avgProfit >= 0 ? 'profit-value' : 'expense-value'}>
              {money(avgProfit)}
            </b>
          </div>
        </section>

        {/* Income vs Expenses Balance Ratio Panel */}
        <section className="panel">
          <SectionTitle title="Income vs Expenses ratio" />
          <p className="panel-subtitle">
            Balance ratio for {rangeInfo.label}
          </p>
          <div className="comparison-card">
            <div className="comparison-legend">
              <span className="legend-item">
                <span className="legend-dot legend-revenue" /> Revenue:{' '}
                {money(totalRevenue)}
              </span>
              <span className="legend-item">
                <span className="legend-dot legend-expense" /> Expenses:{' '}
                {money(totalExpenses)}
              </span>
            </div>
            <div className="comparison-bar-track">
              <div
                className="comparison-bar-revenue"
                style={{
                  width: `${Math.min(100, Math.max(0, revenueRatio))}%`
                }}
              />
            </div>
          </div>

          <div className="payment-breakdown" style={{ marginTop: '16px' }}>
            <div className="payment-line">
              <div className="payment-label">
                <span className="dot cash-dot" />
                Cash collections
                <b>{money(cashRevenue)}</b>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill cash-fill"
                  style={{
                    width: `${totalRevenue ? (cashRevenue / totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div className="payment-line">
              <div className="payment-label">
                <span className="dot online-dot" />
                Online collections
                <b>{money(onlineRevenue)}</b>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill online-fill"
                  style={{
                    width: `${totalRevenue ? (onlineRevenue / totalRevenue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Clinical Activity & Performance Summary */}
      <div className="report-grid" style={{ marginTop: '22px' }}>
        <section className="panel">
          <SectionTitle title="Clinical activity" />
          <p className="panel-subtitle">Patient and treatment stats</p>
          <div className="activity-stat">
            <Users size={18} />
            <span>Total registered patients</span>
            <b>{data.patients.length}</b>
          </div>
          <div className="activity-stat">
            <CalendarDays size={18} />
            <span>Visits in selected period</span>
            <b>{periodVisits.length}</b>
          </div>
          <div className="activity-stat">
            <Droplets size={18} />
            <span>Cups used in selected period</span>
            <b>{cupsUsed}</b>
          </div>
          <div className="activity-stat">
            <Activity size={18} />
            <span>Average cups / visit</span>
            <b>
              {periodVisits.length > 0
                ? (cupsUsed / periodVisits.length).toFixed(1)
                : '0'}
            </b>
          </div>
        </section>

        {/* 6-Month Profit Trend Summary */}
        <section className="panel">
          <SectionTitle title="Recent monthly profit trend" />
          <p className="panel-subtitle">Past 6 months profit track</p>
          <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
            {recentMonths.map((m) => (
              <div
                key={m.ym}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: '#f9fbf9',
                  border: '1px solid #edf2ef',
                  fontSize: '12px'
                }}
              >
                <div>
                  <b style={{ color: '#273c33' }}>{m.label}</b>
                  <div style={{ fontSize: '10px', color: '#889890' }}>
                    {m.visitsCount} visits · Revenue: {money(m.revenue)} · Expenses: {money(m.expenses)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <b
                    style={{
                      color: m.profit >= 0 ? '#087b68' : '#c4523e',
                      fontSize: '13px'
                    }}
                  >
                    {money(m.profit)}
                  </b>
                  <div style={{ fontSize: '10px', color: '#889890' }}>
                    {m.revenue > 0 ? `${m.margin.toFixed(0)}% margin` : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="report-disclaimer">
        Reports and profit calculations are generated from recorded visit fees and expenses for {rangeInfo.label}.
        Please cross-check figures with your actual clinic bank accounts and physical cash receipts.
      </p>
    </>
  )
}
