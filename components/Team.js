import Config from './Config'

class Team {
  constructor(team) {
    this.teamId = team.teamId,
    this.teamName = team.teamName
    //this.teamPlayers = teamPlayers
    this.season = 18
    this.teamPlayers = team.players
  }  

  addPlayer(playerId) {
    this.teamPlayers.push(playerId)
    fetch(Config.server + '/team/players?teamId=' + this.teamId + '&season=' + this.season,
    { 
      method: 'POST',
      body: JSON.stringify({players: this.teamPlayers}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((result) => result.json())
    .then((resultJson) => {
      console.log(resultJson)
    })
    .catch((err) => {
      console.log(err)
    })    
  }

  getPlayers() {
    return this.teamPlayers
  }  
}

export default Team