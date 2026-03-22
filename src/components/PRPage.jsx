import { CATEGORY_COLORS, CATEGORIES } from '../data/exercises'
import { useState } from 'react'

export default function PRPage({ getPRs }) {
  const prs = getPRs()
  const [selectedCat, setSelectedCat] = useState('すべて')

  const entries = Object.entries(prs)
  const filtered = selectedCat === 'すべて'
    ? entries
    : entries.filter(([, v]) => v.category === selectedCat)

  const usedCats = [...new Set(entries.map(([, v]) => v.category))]

  const formatDate = (d) => {
    const dt = new Date(d)
    return `${dt.getMonth() + 1}/${dt.getDate()}`
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">パーソナルレコード</h2>
        <span className="count-badge">{entries.length}種目</span>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p>トレーニングを記録するとPRが表示されます</p>
        </div>
      ) : (
        <>
          <div className="cat-filter-row">
            {['すべて', ...usedCats].map(cat => (
              <button
                key={cat}
                className={`cat-filter-btn ${selectedCat === cat ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat)}
                style={selectedCat === cat && cat !== 'すべて' ? {
                  background: CATEGORY_COLORS[cat]?.bg,
                  color: CATEGORY_COLORS[cat]?.text,
                  borderColor: CATEGORY_COLORS[cat]?.border
                } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pr-grid">
            {filtered.map(([name, pr]) => {
              const colors = CATEGORY_COLORS[pr.category] || CATEGORY_COLORS['その他']
              return (
                <div key={name} className="pr-card">
                  <div className="pr-top">
                    <span className="pr-cat-badge" style={{ background: colors.bg, color: colors.text }}>
                      {pr.category}
                    </span>
                    <span className="pr-date">{formatDate(pr.date)}</span>
                  </div>
                  <div className="pr-name">{name}</div>
                  <div className="pr-weight">
                    <span className="pr-num">{pr.weight}</span>
                    <span className="pr-unit">kg</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
