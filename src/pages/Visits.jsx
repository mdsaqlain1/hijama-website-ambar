import React, { useState } from 'react'
import { PageHeading, SearchBox, VisitTable } from '../components/Common'

export function Visits({ data, setModal, loading, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = data.visits.filter((v) =>
    `${v.patients?.name || ''} ${v.payment_method}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeading
        eyebrow="TREATMENT LOG"
        title="Visits"
        description="Every appointment and treatment, neatly recorded."
        actionLabel="Record visit"
        onAction={() => setModal('visit')}
      />

      <div className="toolbar">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search patient or payment type"
        />
        <span className="result-count">{filtered.length} visits</span>
      </div>

      <div className="panel table-panel">
        <VisitTable
          visits={filtered}
          loading={loading}
          emptyAction={() => setModal('visit')}
          setModal={setModal}
          onDelete={onDelete}
        />
      </div>
    </>
  )
}
