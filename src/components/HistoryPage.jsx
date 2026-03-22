import { useState } from 'react'
import { CATEGORY_COLORS } from '../data/exercises'

export default function HistoryPage({ workouts, deleteWorkout }) {
  const [expanded, setExpanded] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const formatDate = (d) => {
    const dt = new Date(d)
    return `${dt.getMonth() + 1}月${dt.getDate()}日 (${['日','月','火','水','木','金','土'][dt.getDay()]})`
  }

  const calcVolume = (workout) =>
    workout.exercises.reduce((total, ex) =>
      total + ex.sets.reduce((s, set) =>
        s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)

  const calcVolumeByCategory = (workout) =>
    workout.exercises.reduce((acc, ex) => {
      const vol = ex.sets.reduce((s, set) =>
        s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0)
      if (vol > 0) acc[ex.category] = (acc[ex.category] || 0) + vol
      return acc
    }, {})

  if (workouts.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h2 className="page-title">トレーニング履歴</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>まだ記録がありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">トレーニング履歴</h2>
        <span className="count-badge">{workouts.length}回</span>
      </div>

      {workouts.map(workout => {
        const volume = calcVolume(workout)
        const volumeByCategory = calcVolumeByCategory(workout)
        const isOpen = expanded === workout.id
        return (
          <div key={workout.id} className="history-card">
            <button className="history-summary" onClick={() => setExpanded(isOpen ? null : workout.id)}>
              <div className="history-left">
                <span className="history-date">{formatDate(workout.date)}</span>
                <div className="history-tags">
                  {[...new Set(workout.exercises.map(e => e.category))].map(cat => (
                    <span key={cat} className="mini-badge" style={{
                      background: CATEGORY_COLORS[cat]?.bg,
                      color: CATEGORY_COLORS[cat]?.text
                    }}>{cat}</span>
                  ))}
                </div>
              </div>
              <div className="history-right">
                <span className="history-vol">{volume.toLocaleString()} kg</span>
                <span className="chevron">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isOpen && (
              <div className="history-detail">
                {workout.exercises.map(ex => (
                  <div key={ex.id} className="history-exercise">
                    <div className="history-ex-header">
                      <span className="history-ex-name">{ex.name}</span>
                      <span className="history-ex-sets">{ex.sets.length}セット</span>
                    </div>
                    <div className="history-sets">
                      {ex.sets.map((set, i) => (
                        <span key={set.id} className="history-set-chip">
                          {i + 1}: {set.weight || '-'}kg × {set.reps || '-'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="history-cat-volumes">
                  {Object.entries(volumeByCategory).map(([cat, vol]) => {
                    const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS['その他']
                    return (
                      <div key={cat} className="cat-volume-chip" style={{ background: colors.bg, borderColor: colors.border }}>
                        <span className="cat-volume-label" style={{ color: colors.text }}>{cat}</span>
                        <span className="cat-volume-num" style={{ color: colors.text }}>
                          {vol.toLocaleString()}<span className="cat-volume-unit">kg</span>
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="history-footer">
                  <span className="history-total">
                    合計: <strong>{volume.toLocaleString()} kg</strong>
                  </span>
                  {confirmDelete === workout.id ? (
                    <div className="confirm-delete">
                      <span>削除しますか？</span>
                      <button className="btn-danger-sm" onClick={() => { deleteWorkout(workout.id); setConfirmDelete(null); setExpanded(null) }}>削除</button>
                      <button className="btn-ghost-sm" onClick={() => setConfirmDelete(null)}>キャンセル</button>
                    </div>
                  ) : (
                    <button className="btn-ghost-sm" onClick={() => setConfirmDelete(workout.id)}>削除</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
