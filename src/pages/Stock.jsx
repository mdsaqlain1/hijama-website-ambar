import React from 'react'
import { ArrowDownLeft, ArrowUpRight, Package } from 'lucide-react'
import {
  EmptyState,
  PageHeading,
  RowActions,
  SectionTitle,
  StatCard
} from '../components/Common'
import { prettyDate } from '../lib/utils'

export function Stock({ data, setModal, cupsIn, cupsUsed, onDelete }) {
  const left = cupsIn - cupsUsed

  return (
    <>
      <PageHeading
        eyebrow="SUPPLIES"
        title="Cup stock"
        description="Know what came in, what was used and what is left."
        actionLabel="Add stock"
        onAction={() => setModal('stock')}
      />

      <div className="stock-hero">
        <div>
          <div className="stock-label">
            <Package size={16} /> AVAILABLE STOCK
          </div>
          <div className="stock-number">
            {left.toLocaleString('en-IN')} <span>cups</span>
          </div>
          <p>
            {left <= 10
              ? 'Stock is running low. Consider adding more.'
              : 'Your current available cup inventory.'}
          </p>
        </div>
        <div className="stock-illustration">
          <div className="cup-shape">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>

      <div className="stats-grid stock-stats">
        <StatCard
          label="Total added"
          value={cupsIn.toLocaleString('en-IN')}
          icon={ArrowDownLeft}
          tone="green"
          note="All stock entries"
        />
        <StatCard
          label="Total used"
          value={cupsUsed.toLocaleString('en-IN')}
          icon={ArrowUpRight}
          tone="peach"
          note="Across all visits"
        />
      </div>

      <section className="panel table-panel">
        <SectionTitle title="Stock history" />
        <div className="desktop-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th className="align-right">Quantity added</th>
                <th className="align-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.stock.map((s) => (
                <tr key={s.id}>
                  <td>{prettyDate(s.entry_date)}</td>
                  <td>{s.description || 'Stock purchase'}</td>
                  <td className="align-right amount-cell">+{s.quantity}</td>
                  <td>
                    <RowActions
                      label="stock entry"
                      onEdit={() => setModal({ type: 'stock', record: s })}
                      onDelete={() => onDelete('stock_entries', s, 'stock entry')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mobile-list">
          {data.stock.map((s) => (
            <div className="mobile-row" key={s.id}>
              <div className="quick-icon q-green">
                <Package size={18} />
              </div>
              <div className="mobile-row-main">
                <b>{s.description || 'Stock purchase'}</b>
                <span>{prettyDate(s.entry_date)}</span>
                <b className="stock-added">+{s.quantity} cups</b>
              </div>
              <RowActions
                label="stock entry"
                onEdit={() => setModal({ type: 'stock', record: s })}
                onDelete={() => onDelete('stock_entries', s, 'stock entry')}
              />
            </div>
          ))}
        </div>

        {!data.stock.length && (
          <EmptyState
            icon={Package}
            title="No stock entries"
            text="Add your first cup stock purchase."
            action="Add stock"
            onAction={() => setModal('stock')}
          />
        )}
      </section>
    </>
  )
}
