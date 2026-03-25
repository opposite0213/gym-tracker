import { useState } from 'react'
import { CATEGORY_COLORS } from '../data/exercises'

const TARGET_CATEGORIES = ['胸', '背中', '脚']

// 日付→その週の月曜日(YYYY-MM-DD)を返す
function getWeekStart(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

// 週ラベル "3/17" 形式
function weekLabel(weekStart) {
  const d = new Date(weekStart)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function buildWeeklyData(workouts, numWeeks = 8) {
  // 直近N週のweekStartを生成
  const today = new Date()
  const weeks = []
  for (let i = numWeeks - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * 7)
    weeks.push(getWeekStart(d.toISOString().split('T')[0]))
  }

  // weekStart → category → volume
  const map = {}
  weeks.forEach(w => { map[w] = {} })

  workouts.forEach(workout => {
    const ws = getWeekStart(workout.date)
    if (!map[ws]) return
    workout.exercises.forEach(ex => {
      const vol = ex.sets.reduce((s, set) =>
        s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0)
      if (vol > 0) {
        if (!map[ws][ex.category]) map[ws][ex.category] = 0
        map[ws][ex.category] += vol
      }
    })
  })

  return { weeks, map }
}

function LineChart({ weeks, map, activeCategories }) {
  const W = 320
  const H = 180
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  // 最大値
  const allVals = weeks.flatMap(w =>
    activeCategories.map(cat => map[w]?.[cat] || 0)
  )
  const maxVal = Math.max(...allVals, 100)
  const yMax = Math.ceil(maxVal / 500) * 500

  const xPos = (i) => PAD.left + (i / (weeks.length - 1)) * chartW
  const yPos = (v) => PAD.top + chartH - (v / yMax) * chartH

  // Y軸グリッド
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(r => Math.round(yMax * r))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* グリッド線 */}
      {yTicks.map(v => (
        <g key={v}>
          <line
            x1={PAD.left} y1={yPos(v)}
            x2={W - PAD.right} y2={yPos(v)}
            stroke="#38383a" strokeWidth="1"
          />
          <text x={PAD.left - 6} y={yPos(v) + 4}
            textAnchor="end" fontSize="9" fill="#636366">
            {v >= 1000 ? `${v/1000}k` : v}
          </text>
        </g>
      ))}

      {/* X軸ラベル */}
      {weeks.map((w, i) => (
        <text key={w} x={xPos(i)} y={H - 4}
          textAnchor="middle" fontSize="9" fill="#636366">
          {weekLabel(w)}
        </text>
      ))}

      {/* 折れ線 */}
      {activeCategories.map(cat => {
        const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS['その他']
        const points = weeks.map((w, i) => ({
          x: xPos(i),
          y: yPos(map[w]?.[cat] || 0),
          v: map[w]?.[cat] || 0
        }))
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

        return (
          <g key={cat}>
            <path d={d} fill="none" stroke={colors.text} strokeWidth="2" strokeLinejoin="round" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.v > 0 ? 3.5 : 2}
                fill={p.v > 0 ? colors.text : '#2c2c2e'}
                stroke={colors.text} strokeWidth="1.5" />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default function StatsPage({ workouts }) {
  const [numWeeks, setNumWeeks] = useState(8)
  const [activeCategories, setActiveCategories] = useState([...TARGET_CATEGORIES])
  const { weeks, map } = buildWeeklyData(workouts, numWeeks)

  function toggleCategory(cat) {
    setActiveCategories(prev =>
      prev.includes(cat)
        ? prev.length > 1 ? prev.filter(c => c !== cat) : prev
        : [...prev, cat]
    )
  }

  // 週ごとの合計
  const weeklyTotal = weeks.map(w =>
    activeCategories.reduce((s, cat) => s + (map[w]?.[cat] || 0), 0)
  )

  if (workouts.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h2 className="page-title">週次レポート</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>トレーニングを記録するとグラフが表示されます</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">週次レポート</h2>
        <div className="week-range-btns">
          {[4, 8, 12].map(n => (
            <button key={n}
              className={`week-range-btn ${numWeeks === n ? 'active' : ''}`}
              onClick={() => setNumWeeks(n)}>
              {n}週
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリトグル */}
      <div className="stats-cat-toggles">
        {TARGET_CATEGORIES.map(cat => {
          const colors = CATEGORY_COLORS[cat]
          const isActive = activeCategories.includes(cat)
          return (
            <button key={cat}
              className="stats-cat-toggle"
              style={{
                background: isActive ? colors.bg : 'transparent',
                borderColor: isActive ? colors.border : '#38383a',
                color: isActive ? colors.text : '#636366',
              }}
              onClick={() => toggleCategory(cat)}>
              <span className="toggle-dot" style={{ background: isActive ? colors.text : '#636366' }} />
              {cat}
            </button>
          )
        })}
      </div>

      {/* 折れ線グラフ */}
      <div className="chart-card">
        <LineChart weeks={weeks} map={map} activeCategories={activeCategories} />
      </div>

      {/* 数値テーブル */}
      <div className="stats-table">
        <div className="stats-table-header">
          <span className="stats-col-week">週</span>
          {activeCategories.map(cat => {
            const colors = CATEGORY_COLORS[cat]
            return (
              <span key={cat} className="stats-col-val" style={{ color: colors.text }}>
                {cat}
              </span>
            )
          })}
          <span className="stats-col-val" style={{ color: '#aeaeb2' }}>合計</span>
        </div>

        {[...weeks].reverse().map((w, ri) => {
          const i = weeks.length - 1 - ri
          const total = weeklyTotal[i]
          const isCurrentWeek = w === getWeekStart(new Date().toISOString().split('T')[0])
          return (
            <div key={w} className={`stats-table-row ${isCurrentWeek ? 'current-week' : ''}`}>
              <span className="stats-col-week">
                {weekLabel(w)}〜
                {isCurrentWeek && <span className="current-badge">今週</span>}
              </span>
              {activeCategories.map(cat => (
                <span key={cat} className="stats-col-val">
                  {map[w]?.[cat] ? map[w][cat].toLocaleString() : '—'}
                </span>
              ))}
              <span className="stats-col-val stats-total">
                {total > 0 ? total.toLocaleString() : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
