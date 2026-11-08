import React, { useCallback, useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'
import { Check } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { monthStart, todayISO } from './lib/utils'

// Components
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { BottomNav } from './components/BottomNav'
import { Modal } from './components/Modal'
import { RecordForm } from './components/RecordModal'
import { SettingsModal } from './components/SettingsModal'
import { SetupScreen, Login } from './components/Auth'

// Pages
import { Dashboard } from './pages/Dashboard'
import { Patients } from './pages/Patients'
import { Visits } from './pages/Visits'
import { Finances } from './pages/Finances'
import { Expenses } from './pages/Expenses'
import { Stock } from './pages/Stock'
import { Reports } from './pages/Reports'

function AppLayout({
  session,
  data,
  loading,
  loadData,
  saveRecord,
  deleteRecord,
  notify,
  signOut
}) {
  const location = useLocation()
  const [modal, setModalState] = useState(null)
  const setModal = (val) =>
    setModalState(typeof val === 'string' ? { type: val, record: null } : val)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Calculations for dashboard and reports
  const monthVisits = data.visits.filter(
    (v) => v.visit_date >= monthStart() && v.visit_date <= todayISO()
  )
  const monthExpenses = data.expenses.filter(
    (e) => e.expense_date >= monthStart() && e.expense_date <= todayISO()
  )
  const totalRevenue = monthVisits.reduce(
    (sum, v) => sum + Number(v.fee || 0),
    0
  )
  const totalExpenses = monthExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  )
  const cupsIn = data.stock.reduce(
    (sum, s) => sum + Number(s.quantity || 0),
    0
  )
  const cupsUsed = data.visits.reduce(
    (sum, v) => sum + Number(v.cups_used || 0),
    0
  )
  const stockLeft = cupsIn - cupsUsed

  const getPageTitle = (path) => {
    if (path.startsWith('/patients')) return 'Patients'
    if (path.startsWith('/visits')) return 'Visits'
    if (path.startsWith('/finances') || path.startsWith('/expenses')) return 'Expenses'
    if (path.startsWith('/stock')) return 'Cup stock'
    if (path.startsWith('/reports')) return 'Reports'
    return 'Overview'
  }

  const pageProps = {
    data,
    loading,
    setModal,
    onDelete: deleteRecord,
    notify,
    totalRevenue,
    totalExpenses,
    stockLeft,
    cupsIn,
    cupsUsed,
    monthVisits,
    monthExpenses
  }

  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <Sidebar
        session={session}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="main-area">
        {/* Top Navbar with Profile avatar & date chip (No hamburger menu) */}
        <Navbar
          currentLabel={getPageTitle(location.pathname)}
          session={session}
          onSignOut={signOut}
        />

        <div className="page-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<Dashboard {...pageProps} />}
            />
            <Route
              path="/patients"
              element={<Patients {...pageProps} />}
            />
            <Route
              path="/visits"
              element={<Visits {...pageProps} />}
            />
            <Route
              path="/expenses"
              element={<Expenses {...pageProps} />}
            />
            {/* Backward-compatible redirect for finances and profit */}
            <Route
              path="/finances"
              element={<Navigate to="/expenses" replace />}
            />
            <Route
              path="/profit"
              element={<Navigate to="/reports" replace />}
            />
            <Route
              path="/stock"
              element={<Stock {...pageProps} />}
            />
            <Route
              path="/reports"
              element={<Reports {...pageProps} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        <footer className="desktop-footer">
          Hijama Clinic <span>·</span> A simple workspace for your practice
        </footer>
      </main>

      {/* Mobile Bottom Navigation (Home, Patients, Visits, Expenses, More) */}
      <BottomNav
        session={session}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Modals */}
      {modal && (
        <Modal
          title={`${modal.record ? 'Edit' : 'Add'} ${
            modal.type === 'patient'
              ? 'patient'
              : modal.type === 'visit'
              ? 'visit'
              : modal.type === 'expense'
              ? 'expense'
              : 'cup stock'
          }`}
          onClose={() => setModal(null)}
        >
          <RecordForm
            type={modal.type}
            record={modal.record}
            patients={data.patients}
            onSave={saveRecord}
            notify={notify}
          />
        </Modal>
      )}

      {/* Settings Modal (Change Email & Password) */}
      {settingsOpen && (
        <SettingsModal
          session={session}
          onClose={() => setSettingsOpen(false)}
          notify={notify}
        />
      )}
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [data, setData] = useState({
    patients: [],
    visits: [],
    expenses: [],
    stock: []
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    )
    return () => subscription.unsubscribe()
  }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const loadData = useCallback(async () => {
    if (!session) return false
    setLoading(true)
    try {
      const [p, v, e, s] = await Promise.all([
        supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('visits')
          .select('*, patients(name, phone)')
          .order('visit_date', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('stock_entries')
          .select('*')
          .order('entry_date', { ascending: false })
          .order('created_at', { ascending: false })
      ])
      const failed = [p, v, e, s].find((result) => result.error)
      if (failed) {
        notify(`Could not refresh clinic records: ${failed.error.message}`)
        return false
      }
      setData({
        patients: p.data || [],
        visits: v.data || [],
        expenses: e.data || [],
        stock: s.data || []
      })
      return true
    } catch (error) {
      notify(error?.message || 'Something went wrong while loading records.')
      return false
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function saveRecord(table, payload, success, id = null) {
    const query = supabase.from(table)
    const result = id
      ? await query.update(payload).eq('id', id).select().single()
      : await query.insert(payload).select().single()
    if (result.error) {
      notify(`Could not save record: ${result.error.message}`)
      return false
    }
    const refreshed = await loadData()
    if (!refreshed) {
      notify(
        'Record was saved, but the dashboard could not refresh. Reload the page.'
      )
      return false
    }
    notify(success)
    return true
  }

  async function deleteRecord(table, record, label) {
    if (
      table === 'patients' &&
      data.visits.some((visit) => visit.patient_id === record.id)
    ) {
      notify(
        'This patient has visit history. Delete or reassign those visits first to preserve data integrity.'
      )
      return
    }
    const ok = window.confirm(
      `Delete this ${label}? This action cannot be undone.`
    )
    if (!ok) return
    const { error } = await supabase.from(table).delete().eq('id', record.id)
    if (error) {
      notify(`Could not delete ${label}: ${error.message}`)
      return
    }
    await loadData()
    notify(`${label[0].toUpperCase()}${label.slice(1)} deleted.`)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (authLoading)
    return (
      <div className="screen-center">
        <div className="loader" />
      </div>
    )
  if (!isSupabaseConfigured) return <SetupScreen />
  if (!session) return <Login onLogin={setSession} />

  return (
    <BrowserRouter>
      <AppLayout
        session={session}
        data={data}
        loading={loading}
        loadData={loadData}
        saveRecord={saveRecord}
        deleteRecord={deleteRecord}
        notify={notify}
        signOut={signOut}
      />
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </BrowserRouter>
  )
}
