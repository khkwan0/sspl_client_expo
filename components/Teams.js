import Team from './Team'

class Teams {
  constructor() {
    this.teams = []
  }

  getTeam(teamId) {
    i = 0
    found = false
    rv = null

    while (i < this.teams.length && !found) {
      if (this.teams[i].teamId == teamId) {
        found = true;
        rv = this.teams[i]
      }
      i++
    }
    return rv
  }

  add(team) {
    this.teams.push(team)
  }

  getTeams() {
    return this.teams
  }
}

export default Teams