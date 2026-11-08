import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  IndianRupee,
  Package,
  Sparkles,
  Stethoscope,
  TrendingUp,
  UserRound,
  Wallet
} from 'lucide-react'
import {
  SectionTitle,
  StatCard,
  VisitTable
} from '../components/Common'
import { money, todayISO, toLocalISO } from '../lib/utils'

export function Dashboard({
  data,
  loading,
  totalRevenue,
  totalExpenses,
  stockLeft,
  monthVisits,
  setModal,
  onDelete
}) {
  const navigate = useNavigate()
  const todayVisits = data.visits.filter((v) => v.visit_date === todayISO())
  const todayRevenue = todayVisits.reduce((s, v) => s + Number(v.fee || 0), 0)
  const recent = data.visits.slice(0, 5)

  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = toLocalISO(d)
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      amount: data.visits
        .filter((v) => v.visit_date === key)
        .reduce((s, v) => s + Number(v.fee || 0), 0)
    }
  })
  const max = Math.max(1, ...daily.map((d) => d.amount))

  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-kicker">
            <Sparkles size={14} /> YOUR CLINIC AT A GLANCE
          </div>
          <h1>
            A healthier way to
            <br className="desktop-break" /> manage your day.
          </h1>
          <p>Here’s what’s happening at your clinic.</p>
        </div>
        <div className="welcome-art">
          <div className="art-circle art-one" />
          <div className="art-circle art-two" />
          <div className="art-icon">
            <Stethoscope size={35} />
          </div>
          <span className="art-spark">✳</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Today's collection"
          value={money(todayRevenue)}
          icon={IndianRupee}
          tone="green"
          note={`${todayVisits.length} visits today`}
        />
        <StatCard
          label="Monthly revenue"
          value={money(totalRevenue)}
          icon={TrendingUp}
          tone="blue"
          note={`${monthVisits.length} visits this month`}
        />
        <StatCard
          label="Monthly expenses"
          value={money(totalExpenses)}
          icon={Wallet}
          tone="peach"
          note="Recorded this month"
        />
        <StatCard
          label="Cups remaining"
          value={stockLeft.toLocaleString('en-IN')}
          icon={Package}
          tone="purple"
          note="Available in stock"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <SectionTitle title="Collection overview" />
          <div className="chart-subtitle">Daily collections · Last 7 days</div>
          <div className="chart-total">
            {money(daily.reduce((s, d) => s + d.amount, 0))}
            <span> total</span>
          </div>
          <div className="bar-chart">
            {daily.map((d, i) => (
              <div className="bar-column" key={i}>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${i === 6 ? 'today' : ''}`}
                    style={{
                      height: `${Math.max(4, (d.amount / max) * 100)}%`
                    }}
                    title={money(d.amount)}
                  />
                </div>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel quick-panel">
          <SectionTitle title="Quick actions" />
          <p className="panel-subtitle">A few things you can do right away.</p>
          <div className="quick-actions">
            <button onClick={() => setModal('patient')}>
              <span className="quick-icon q-green">
                <UserRound size={18} />
              </span>
              <span>
                <b>New patient</b>
                <small>Add someone to your clinic</small>
              </span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => setModal('visit')}>
              <span className="quick-icon q-blue">
                <CalendarDays size={18} />
              </span>
              <span>
                <b>Record a visit</b>
                <small>Save today's treatment entry</small>
              </span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => setModal('expense')}>
              <span className="quick-icon q-peach">
                <Wallet size={18} />
              </span>
              <span>
                <b>Add expense</b>
                <small>Keep track of clinic spending</small>
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <SectionTitle
          title="Recent visits"
          link="View all visits"
          onClick={() => navigate('/visits')}
        />
        <VisitTable
          visits={recent}
          loading={loading}
          emptyAction={() => setModal('visit')}
          setModal={setModal}
          onDelete={onDelete}
        />
      </section>
    </>
  )
}
