import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { todayISO } from '../lib/utils'
import { Field } from './Common'

export function RecordForm({ type, record, patients, onSave, notify }) {
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState(() => ({
    name: record?.name || '',
    phone: record?.phone || '',
    patient_id: record?.patient_id || '',
    visit_date: record?.visit_date || todayISO(),
    cups_used: record?.cups_used ?? '',
    fee: record?.fee ?? '',
    payment_method: record?.payment_method || 'Cash',
    expense_date: record?.expense_date || todayISO(),
    description: record?.description || '',
    amount: record?.amount ?? '',
    entry_date: record?.entry_date || todayISO(),
    quantity: record?.quantity ?? ''
  }))

  const update = (key, value) =>
    setForm((old) => ({ ...old, [key]: value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    let table, payload, success

    if (type === 'patient') {
      table = 'patients'
      payload = {
        name: form.name.trim(),
        phone: form.phone.trim() || null
      }
      success = 'Patient added successfully.'
    }
    if (type === 'visit') {
      if (!form.patient_id) {
        notify('Please select a patient.')
        setBusy(false)
        return
      }
      table = 'visits'
      payload = {
        patient_id: form.patient_id,
        visit_date: form.visit_date,
        cups_used: Number(form.cups_used),
        fee: Number(form.fee),
        payment_method: form.payment_method
      }
      success = 'Visit recorded successfully.'
    }
    if (type === 'expense') {
      table = 'expenses'
      payload = {
        expense_date: form.expense_date,
        description: form.description.trim(),
        amount: Number(form.amount)
      }
      success = 'Expense saved successfully.'
    }
    if (type === 'stock') {
      table = 'stock_entries'
      payload = {
        entry_date: form.entry_date,
        quantity: Number(form.quantity),
        description: form.description.trim() || 'Stock purchase'
      }
      success = 'Stock added successfully.'
    }

    if (record) {
      success = success.replace(
        /added successfully|recorded successfully|saved successfully/,
        'updated successfully'
      )
    }

    await onSave(table, payload, success, record?.id || null)
    setBusy(false)
  }

  return (
    <form className="form-stack modal-form" onSubmit={submit}>
      {type === 'patient' && (
        <>
          <Field label="Patient name">
            <input
              autoFocus
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Enter full name"
              required
              maxLength={100}
            />
          </Field>
          <Field label="Phone number" hint="Optional">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="e.g. 98765 43210"
              maxLength={20}
            />
          </Field>
        </>
      )}

      {type === 'visit' && (
        <>
          <Field label="Select patient">
            <select
              value={form.patient_id}
              onChange={(e) => update('patient_id', e.target.value)}
              required
            >
              <option value="">Choose a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.phone ? ` · ${p.phone}` : ''}
                </option>
              ))}
            </select>
            {!patients.length && (
              <small>Add a patient before recording a visit.</small>
            )}
          </Field>
          <Field label="Visit date">
            <input
              type="date"
              value={form.visit_date}
              onChange={(e) => update('visit_date', e.target.value)}
              required
            />
          </Field>
          <div className="form-two">
            <Field label="Cups used">
              <input
                type="number"
                min="0"
                step="1"
                value={form.cups_used}
                onChange={(e) => update('cups_used', e.target.value)}
                placeholder="0"
                required
              />
            </Field>
            <Field label="Fees (₹)">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.fee}
                onChange={(e) => update('fee', e.target.value)}
                placeholder="0"
                required
              />
            </Field>
          </div>
          <Field label="Payment method">
            <select
              value={form.payment_method}
              onChange={(e) => update('payment_method', e.target.value)}
            >
              <option>Cash</option>
              <option>Online</option>
            </select>
          </Field>
        </>
      )}

      {type === 'expense' && (
        <>
          <Field label="Expense description">
            <input
              autoFocus
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="e.g. Cotton, gloves, rent"
              required
              maxLength={150}
            />
          </Field>
          <Field label="Date">
            <input
              type="date"
              value={form.expense_date}
              onChange={(e) => update('expense_date', e.target.value)}
              required
            />
          </Field>
          <Field label="Amount (₹)">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => update('amount', e.target.value)}
              placeholder="0"
              required
            />
          </Field>
        </>
      )}

      {type === 'stock' && (
        <>
          <Field label="Quantity received">
            <input
              autoFocus
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="Number of cups"
              required
            />
          </Field>
          <Field label="Date received">
            <input
              type="date"
              value={form.entry_date}
              onChange={(e) => update('entry_date', e.target.value)}
              required
            />
          </Field>
          <Field label="Note" hint="Optional">
            <input
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="e.g. Purchase from supplier"
              maxLength={150}
            />
          </Field>
        </>
      )}

      <div className="modal-actions">
        <button
          className="primary-button"
          disabled={busy || (type === 'visit' && !patients.length)}
        >
          {busy ? 'Saving…' : record ? 'Save changes' : 'Save record'}
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  )
}
