import React, { useState } from 'react'
import { Pencil, Trash2, Users } from 'lucide-react'
import { EmptyState, PageHeading, SearchBox } from '../components/Common'
import { initials, prettyDate } from '../lib/utils'

export function Patients({ data, setModal, loading, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = data.patients.filter((p) =>
    `${p.name} ${p.phone || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeading
        eyebrow="YOUR PEOPLE"
        title="Patients"
        description="A simple, organised list of everyone who visits your clinic."
        actionLabel="Add patient"
        onAction={() => setModal('patient')}
      />

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by name or phone"
        />
        <span className="result-count">{filtered.length} patients</span>
      </div>

      <div className="panel table-panel">
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Phone</th>
                <th>Added on</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar avatar-soft">
                        {initials(p.name)}
                      </div>
                      <b>{p.name}</b>
                    </div>
                  </td>
                  <td>{p.phone || '—'}</td>
                  <td>{prettyDate(p.created_at?.slice(0, 10))}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="action-button"
                        title="Edit patient"
                        onClick={() => setModal({ type: 'patient', record: p })}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="action-button danger"
                        title="Delete patient"
                        onClick={() => onDelete('patients', p, 'patient')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {filtered.map((p) => (
            <div className="mobile-row" key={p.id}>
              <div className="avatar avatar-soft">{initials(p.name)}</div>
              <div className="mobile-row-main">
                <b>{p.name}</b>
                <span>{p.phone || 'No phone added'}</span>
              </div>
              <div className="mobile-row-actions">
                <button
                  className="action-button"
                  aria-label="Edit patient"
                  onClick={() => setModal({ type: 'patient', record: p })}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="action-button danger"
                  aria-label="Delete patient"
                  onClick={() => onDelete('patients', p, 'patient')}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="loading-line">Loading patients…</div>
        ) : (
          !filtered.length && (
            <EmptyState
              icon={Users}
              title={search ? 'No matching patients' : 'No patients yet'}
              text={
                search
                  ? 'Try another name or phone number.'
                  : 'Add your first patient to get started.'
              }
              action="Add patient"
              onAction={() => setModal('patient')}
            />
          )
        )}
      </div>
    </>
  )
}
