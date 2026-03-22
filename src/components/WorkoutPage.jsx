import { useState, useRef } from 'react'
import { PRESET_EXERCISES, CATEGORY_COLORS } from '../data/exercises'

export default function WorkoutPage({ saveWorkout, getLastWorkout, getPRs }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [exercises, setExercises] = useState([])
  const [showExPicker, setShowExPicker] = useState(false)
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)
  const prs = getPRs()

  function addExercise(preset) {
    setExercises(prev => [...prev, {
      id: Date.now(),
      name: preset.name,
      category: preset.category,
      sets: [{ id: Date.now() + 1, weight: '', reps: '', done: false }]
    }])
    setShowExPicker(false)
    setSearch('')
  }

  function addCustomExercise() {
    if (!search.trim()) return
    addExercise({ name: search.trim(), category: 'その他' })
  }

  function addSet(exId) {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      const last = ex.sets[ex.sets.length - 1]
      return {
        ...ex,
        sets: [...ex.sets, {
          id: Date.now(),
          weight: last?.weight ?? '',
          reps: last?.reps ?? '',
          done: false
        }]
      }
    }))
  }

  function updateSet(exId, setId, field, value) {
    setExercises(prev => prev.map(ex => ex.id !== exId ? ex : {
      ...ex,
      sets: ex.sets.map(s => s.id !== setId ? s : { ...s, [field]: value })
    }))
  }

  function removeSet(exId, setId) {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== exId) return ex
      const sets = ex.sets.filter(s => s.id !== setId)
      return sets.length === 0 ? null : { ...ex, sets }
    }).filter(Boolean))
  }

  function removeExercise(exId) {
    setExercises(prev => prev.filter(ex => ex.id !== exId))
  }

  function copyLastWorkout() {
    const last = getLastWorkout()
    if (!last) return
    setExercises(last.exercises.map(ex => ({
      ...ex,
      id: Date.now() + Math.random(),
      sets: ex.sets.map(s => ({ ...s, id: Date.now() + Math.random(), done: false }))
    })))
  }

  function handleSave() {
    const filled = exercises.filter(ex =>
      ex.sets.some(s => s.weight || s.reps)
    )
    if (filled.length === 0) return
    saveWorkout({ id: Date.now(), date, exercises: filled })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filtered = PRESET_EXERCISES.filter(e =>
    e.name.includes(search) || e.category.includes(search)
  )
  const totalVolume = exercises.reduce((total, ex) =>
    total + ex.sets.reduce((s, set) =>
      s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)

  const formatDate = (d) => {
    const dt = new Date(d)
    return `${dt.getMonth() + 1}月${dt.getDate()}日 (${['日','月','火','水','木','金','土'][dt.getDay()]})`
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">トレーニング記録</h2>
          <div className="date-selector">
            <button
              className={`date-today-btn ${date === today ? 'active' : ''}`}
              onClick={() => setDate(today)}
            >
              今日
            </button>
            <input
              type="date"
              className="date-input"
              value={date}
              max={today}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <p className="date-label">{formatDate(date)}</p>
        </div>
        {totalVolume > 0 && (
          <div className="volume-badge">
            <span className="volume-num">{totalVolume.toLocaleString()}</span>
            <span className="volume-unit">kg vol</span>
          </div>
        )}
      </div>

      {exercises.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏋️</div>
          <p>種目を追加してトレーニングを記録しよう</p>
          {getLastWorkout() && (
            <button className="btn-ghost" onClick={copyLastWorkout}>
              前回のメニューをコピー
            </button>
          )}
        </div>
      )}

      {exercises.map((ex, exIdx) => {
        const pr = prs[ex.name]
        const colors = CATEGORY_COLORS[ex.category] || CATEGORY_COLORS['その他']
        return (
          <div key={ex.id} className="exercise-card">
            <div className="exercise-header">
              <div className="exercise-title-row">
                <span className="cat-badge" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                  {ex.category}
                </span>
                <span className="exercise-name">{ex.name}</span>
              </div>
              <div className="exercise-actions">
                {pr && <span className="pr-info">PR {pr.weight}kg</span>}
                <button className="icon-btn danger" onClick={() => removeExercise(ex.id)}>✕</button>
              </div>
            </div>

            <div className="sets-header">
              <span>セット</span>
              <span>重量 (kg)</span>
              <span>回数</span>
              <span></span>
            </div>

            {ex.sets.map((set, i) => (
              <div key={set.id} className={`set-row ${set.done ? 'set-done' : ''}`}>
                <button
                  className={`set-num ${set.done ? 'done' : ''}`}
                  onClick={() => updateSet(ex.id, set.id, 'done', !set.done)}
                >
                  {i + 1}
                </button>
                <input
                  type="number"
                  inputMode="decimal"
                  className="set-input"
                  value={set.weight}
                  placeholder={pr ? String(pr.weight) : '0'}
                  onChange={e => updateSet(ex.id, set.id, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  className="set-input"
                  value={set.reps}
                  placeholder="0"
                  onChange={e => updateSet(ex.id, set.id, 'reps', e.target.value)}
                />
                <button className="icon-btn" onClick={() => removeSet(ex.id, set.id)}>✕</button>
              </div>
            ))}

            <button className="btn-add-set" onClick={() => addSet(ex.id)}>
              + セット追加
            </button>
          </div>
        )
      })}

      <div className="bottom-actions">
        {exercises.length > 0 && getLastWorkout() && (
          <button className="btn-ghost small" onClick={copyLastWorkout}>前回コピー</button>
        )}
        <button className="btn-add-exercise" onClick={() => setShowExPicker(true)}>
          + 種目を追加
        </button>
        {exercises.length > 0 && (
          <button className={`btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? '保存済み ✓' : 'ワークアウトを保存'}
          </button>
        )}
      </div>

      {showExPicker && (
        <div className="modal-overlay" onClick={() => setShowExPicker(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>種目を選択</h3>
              <button className="icon-btn" onClick={() => setShowExPicker(false)}>✕</button>
            </div>
            <input
              className="search-input"
              type="text"
              placeholder="種目名で検索..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div className="exercise-list">
              {filtered.map(ex => (
                <button key={ex.name} className="exercise-option" onClick={() => addExercise(ex)}>
                  <span className="ex-opt-name">{ex.name}</span>
                  <span className="ex-opt-cat" style={{ color: CATEGORY_COLORS[ex.category]?.text }}>
                    {ex.category}
                  </span>
                </button>
              ))}
              {search && !PRESET_EXERCISES.find(e => e.name === search) && (
                <button className="exercise-option custom" onClick={addCustomExercise}>
                  <span>「{search}」を追加</span>
                  <span className="ex-opt-cat">カスタム</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
