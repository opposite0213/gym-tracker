export default function BottomNav({ page, setPage, onLogout }) {
  const tabs = [
    { id: 'workout', label: '記録',   icon: <DumbbellIcon /> },
    { id: 'history', label: '履歴',   icon: <CalendarIcon /> },
    { id: 'stats',   label: 'グラフ', icon: <ChartIcon /> },
    { id: 'pr',      label: 'PR',     icon: <TrophyIcon /> },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${page === tab.id ? 'active' : ''}`}
          onClick={() => setPage(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
      <button className="nav-tab" onClick={onLogout}>
        <span className="nav-icon"><LogoutIcon /></span>
        <span className="nav-label">ログアウト</span>
      </button>
    </nav>
  )
}

function DumbbellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16M18 4v16M6 9h12M6 15h12M2 7h4M18 7h4M2 17h4M18 17h4"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4M7 3H4a1 1 0 0 0-1 1v4a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V4a1 1 0 0 0-1-1h-3"/>
      <path d="M7 3h10v8a5 5 0 0 1-10 0V3z"/>
    </svg>
  )
}
