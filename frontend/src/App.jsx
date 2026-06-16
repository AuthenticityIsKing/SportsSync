import { useState, useEffect } from 'react'



function App() {
  const [teams, setTeams] = useState([])          // list of teams from the API
  const [selected, setSelected] = useState([])    // teams the user has picked

  // useEffect runs code when the component first loads
  useEffect(() => {
    fetch('http://localhost:8000/teams/soccer/eng.1')
      .then(response => response.json())
      .then(data => setTeams(data.teams))
  }, [])  // the [] is "only run this once, on first load"

  // toggling team, if selected, change list
  function toggleTeam(team) {
    if (selected.includes(team)) {
      setSelected(selected.filter(t => t !== team))  // remove it
    } else {
      setSelected([...selected, team])               // add it
    }
  }

  return (
    <div>
      <h1>Pick Your Teams</h1>
      {teams.map(team => (
        <div key={team.name}>
          <input
            type="checkbox"
            checked={selected.includes(team.name)}
            onChange={() => toggleTeam(team.name)}
          />
          <label>{team.name}</label>
        </div>
      ))}
      <p>Selected: {selected.join(', ')}</p>
    </div>
  )
}

export default App