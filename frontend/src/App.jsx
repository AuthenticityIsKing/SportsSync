import { useState, useEffect } from 'react'

const SPORTS = [
  { name: "Soccer", value: "soccer" },
  { name: "Basketball", value: "basketball" },
]

const LEAGUES = {
  soccer: [
    { name: "Premier League", value: "eng.1" },
    { name: "La Liga", value: "esp.1" },
    { name: "Champions League", value: "uefa.champions" },
  ],
  basketball: [
    { name: "NBA", value: "nba" },
  ]
}

function App() {
  const [step, setStep] = useState(1)
  const [sport, setSport] = useState(null)
  const [league, setLeague] = useState(null)
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState([])
  const [beginDate, setBeginDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (!sport || !league) return
    fetch(`http://localhost:8000/teams/${sport}/${league}`)
      .then(response => response.json())
      .then(data => setTeams(data.teams))
  }, [sport, league])

  function toggleTeam(abbreviation) {
    if (selected.includes(abbreviation)) {
      setSelected(selected.filter(t => t !== abbreviation))
    } else {
      setSelected([...selected, abbreviation])
    }
  }

  function submitSchedule() {
    fetch('http://localhost:8000/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sport,
        league,
        teams: selected,
        begin_date: beginDate,
        end_date: endDate
      })
    })
      .then(response => response.blob())
      .then(data => {
        const url = window.URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = 'calendar.ics'
        a.click()
      })
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        {['Sport', 'League', 'Teams', 'Dates', 'Confirm'].map((label, i) => (
          <div key={label} style={{ fontWeight: step === i + 1 ? 'bold' : 'normal', opacity: step >= i + 1 ? 1 : 0.4 }}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {/* Sport */}
      {step === 1 && (
        <div>
          <h2>Pick a Sport</h2>
          {SPORTS.map(s => (
            <button key={s.value} onClick={() => { setSport(s.value); setStep(2) }}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* League */}
      {step === 2 && (
        <div>
          <h2>Pick a League</h2>
          {LEAGUES[sport].map(l => (
            <button key={l.value} onClick={() => { setLeague(l.value); setStep(3) }}>
              {l.name}
            </button>
          ))}
        </div>
      )}

      {/* Step 3 - Teams */}
      {step === 3 && (
        <div>
          <h2>Pick Your Teams</h2>
          {teams.map(team => (
            <div key={team.abbreviation}>
              <input
                type="checkbox"
                checked={selected.includes(team.abbreviation)}
                onChange={() => toggleTeam(team.abbreviation)}
              />
              <label>{team.name}</label>
            </div>
          ))}
          <button onClick={() => setStep(4)} disabled={selected.length === 0}>
            Next
          </button>
        </div>
      )}

      {/* Step 4 - Dates */}
      {step === 4 && (
        <div>
          <h2>Pick a Date Range</h2>
          <label>Start Date: <input type="date" value={beginDate} onChange={e => setBeginDate(e.target.value)} /></label>
          <label>End Date: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></label>
          <button onClick={() => setStep(5)} disabled={!beginDate || !endDate}>
            Next
          </button>
        </div>
      )}

      {/* Step 5 - Confirm */}
      {step === 5 && (
        <div>
          <h2>Confirm</h2>
          <p>Sport: {sport}</p>
          <p>League: {league}</p>
          <p>Teams: {selected.join(', ')}</p>
          <p>From: {beginDate} to {endDate}</p>
          <button onClick={submitSchedule}>Create Calendar</button>
        </div>
      )}
    </div>
  )
}

export default App