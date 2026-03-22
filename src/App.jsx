import { useState } from 'react'
import { useWorkouts } from './hooks/useWorkouts'
import WorkoutPage from './components/WorkoutPage'
import HistoryPage from './components/HistoryPage'
import PRPage from './components/PRPage'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [page, setPage] = useState('workout')
  const { workouts, saveWorkout, deleteWorkout, getPRs, getLastWorkout } = useWorkouts()

  return (
    <div className="app">
      <div className="content">
        {page === 'workout' && (
          <WorkoutPage
            saveWorkout={saveWorkout}
            getLastWorkout={getLastWorkout}
            getPRs={getPRs}
          />
        )}
        {page === 'history' && (
          <HistoryPage
            workouts={workouts}
            deleteWorkout={deleteWorkout}
          />
        )}
        {page === 'pr' && (
          <PRPage getPRs={getPRs} />
        )}
      </div>
      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
