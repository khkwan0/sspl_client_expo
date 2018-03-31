import Player from './Player'
import Config from './Config'

class Players {
  constructor(players) {
    if (players) {
      this.players = players
    } else {
      this.players = []
    }
  }

  addNewPlayer(playerName) {
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/players',
      {
        method: 'POST',
        body: JSON.stringify({newPlayerName: playerName}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'        
      })
      .then((result) => result.json())
      .then((resultJson) => {
        if (resultJson && typeof resultJson.playerId != 'undefined')
        {
          let player = this.addPlayer(resultJson.playerId, playerName)
          resolve(player)
        } else {
          reject('invalid server response')
        }
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  addPlayer(playerId, playerName) {
    let player = new Player(playerId, playerName)
    this.players.push(player)
    return player
  }

  addPrePlayer(player) {
    this.players.push(player)
  }

  getPlayer(playerId) {
    let i = 0
    let found = false
    let rv = null
    while (i < this.players.length && !found) {
      if (this.players[i].playerId == playerId ) {
        rv = this.players[i]
        found = true
      }
      i++
    }
    return rv
  }
}

export default Players