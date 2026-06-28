import { useState, useEffect } from 'react'
import './App.css'
import logo from './assets/sportsync-logo-trimmed.png'

const SPORTS = [
  { name: "Soccer", value: "soccer" },
  { name: "Basketball", value: "basketball" },
  { name: "Baseball", value: "baseball"},
  { name: "Football", value: "football"}
]

const LEAGUES = {
  soccer: [
    { name: "Premier League", value: "eng.1" },
    { name: "La Liga", value: "esp.1" },
    { name: "Bundesliga", value: "ger.1" },
    { name: "Serie A", value: "ita.1" },
    { name: "Ligue 1", value: "fra.1" },
    { name: "MLS", value: "usa.1" },
    { name: "Liga MX", value: "mex.1" },
    { name: "Eredivisie", value: "ned.1" },
    { name: "Champions League", value: "uefa.champions" },
    { name: "Europa League", value: "uefa.europa" },
    { name: "World Cup", value: "fifa.world" },
    { name: "Euros", value: "uefa.euro" },
    { name: "Primeira Liga", value: "por.1"}
  ],
  basketball: [{ name: "NBA", value: "nba" }],
  football: [{ name: "NFL", value: "nfl" }],
  baseball: [{ name: "MLB", value: "mlb" }],
}



function App() {
  const [step, setStep] = useState(1)
  const [sport, setSport] = useState(null)
  const [league, setLeague] = useState(null)
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState([])
  const [season, setSeason] = useState(null)
  const [seasonLoading, setSeasonLoading] = useState(false)

  useEffect(() => {
    if (step !== 4) return
    setSeasonLoading(true)
    fetch(`/season/${sport}/${league}`)
      .then(r => r.json())
      .then(data => {
        setSeason(data)
        setSeasonLoading(false)
      })
  }, [step])

  useEffect(() => {
    if (!sport || !league) return
    fetch(`/teams/${sport}/${league}`)
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

  function getLeagueName(sportValue, leagueValue){
    const found = LEAGUES[sportValue]?.find(l => l.value === leagueValue)
    return found ? found.name : leagueValue
  }

  function getTeamNames(abbreviations){
    return abbreviations.map(abbr => teams.find(t => t.abbreviation === abbr)?.name || abbr).join(', ')
  }

  function getSeasonYears(label){
    const match = label.match(/^\d{4}-\d{2}|\d{4}/)
    return match ? match[0] : label
  }

  function submitSchedule() {
    fetch('/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sport,
        league,
        teams: selected,
        begin_date: season.begin,
        end_date: season.end
      })
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'calendar.ics'
        a.click()
      })
  }

  const hasLeagueStep = sport ? LEAGUES[sport].length > 1: true

  const stepLabels = hasLeagueStep
      ? ['Sport', 'League', 'Teams', 'Confirm']
      : ['Sport', 'Teams', 'Confirm']

  function displayIndexForStep(currentStep){
    if (hasLeagueStep) return currentStep - 1
    if (currentStep === 1) return 0
    return currentStep - 2
  }

  const currentDisplayIndex = displayIndexForStep(step)

  function selectSport(sportValue){
    setSport(sportValue)
    const leagues = LEAGUES[sportValue]
    if (leagues.length === 1) {
      setLeague(leagues[0].value)
      setStep(3)
    } else{
      setStep(2)
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <img src={logo} alt = "SportsSync logo" className = "logo" />
        <span className = "app-name">SportsSync</span>
      </div>
      {/* Progress indicator */}
      <div className="progress">
        {stepLabels.map((label, i) => (
          <div
            key={label}
            className={`progress-step ${currentDisplayIndex === i ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Step 1 - Sport */}
      {step === 1 && (
        <div>
          <h2>Pick a sport</h2>
          <div className="choice-grid">
            {SPORTS.map(s => (
              <button
                key={s.value}
                className="choice-button"
                onClick={() => { selectSport(s.value) }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 - League */}
      {step === 2 && (
        <div>
          <h2>Pick a league</h2>
          <div className="choice-grid">
            {LEAGUES[sport].map(l => (
              <button
                key={l.value}
                className="choice-button"
                onClick={() => { setLeague(l.value); setStep(3) }}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 - Teams */}
      {step === 3 && (
        <div>
          <h2>Pick your teams</h2>
          <div className="team-grid">
            {teams.map(team => (
              <div
                key={team.abbreviation}
                className={`team-card ${selected.includes(team.abbreviation) ? 'selected' : ''}`}
                onClick={() => toggleTeam(team.abbreviation)}
              >
                <img src={team.logo} alt={team.name} />
                <span>{team.name}</span>
              </div>
            ))}
          </div>
          <button
            className="primary-button"
            onClick={() => setStep(4)}
            disabled={selected.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 4 - Dates */}

      {/* Step 4 - Season + Confirm (combined) */}
      {step === 4 && (
        <div>
          <h2>Confirm your calendar</h2>

          <div className="summary-row">
            <span className="summary-label">Sport</span>
            <span>{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">League</span>
            <span>{getLeagueName(sport, league)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Teams</span>
            <span>{getTeamNames(selected)}</span>
          </div>

          {seasonLoading ? (
            <div className="summary-row">
              <span className="summary-label">Season</span>
              <span className="hint-text">Loading...</span>
            </div>
          ) : season ? (
            <div className="summary-row">
              <span className="summary-label">Season</span>
              <span>{getSeasonYears(season.label)}</span>
            </div>
          ) : (
            <div className="summary-row">
              <span className="summary-label">Season</span>
              <span className="hint-text">No season data available</span>
            </div>
          )}

          <button
            className="primary-button"
            onClick={submitSchedule}
            disabled={!season || seasonLoading}
          >
            Create calendar
          </button>
        </div>
      )}


    </div>
  )
}

export default App