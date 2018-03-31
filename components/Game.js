import React, {Component} from 'react'
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native'
import PlayerPicker from './PlayerPicker'
import AddPlayer from './AddPlayer'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPlayerPicker: false,
      showAddNewPlayerModal: false
    }

    this.winner = 'na'

    this.playerPickerIsHome = true
    this.playerPickerIsTop = true
    this.playerPickerTeam = null
    this.homeTeam = this.props.homeTeam
    this.awayTeam = this.props.awayTeam

    this.choosePlayer = this.choosePlayer.bind(this)
    this.setWinner = this.setWinner.bind(this)
    this.setPlayer = this.setPlayer.bind(this)
    this.closePlayerPicker = this.closePlayerPicker.bind(this)
    this.showAddPlayer = this.showAddPlayer.bind(this)
    this.closeAddNewPlayerModal = this.closeAddNewPlayerModal.bind(this)
    this.addNewPlayer = this.addNewPlayer.bind(this)
  }

  choosePlayer(isHome, isTop) {
    if (!this.props.inComplete) {
      team = isHome ? this.homeTeam: this.awayTeam
      this.playerPickerIsTop = isTop
      this.playerPickerIsHome = isHome
      this.playerPickerTeam = team

      this.setState({
        showPlayerPicker: true
      })
    }
  }

  showAddPlayer() {
    this.setState({
      showPlayerPicker: false,
      showAddNewPlayerModal: true
    })
  }

  addNewPlayer(player) {
    if (this.playerPickerIsHome) {
      this.homeTeam.addPlayer(player.playerId)      
    } else {
      this.awayTeam.addPlayer(player.playerId)
    }
    this.setPlayer(player.playerId)
  }

  setPlayer(playerId) {
    if (!this.props.isComplete) {
      if (this.playerPickerIsHome) {
        if (this.playerPickerIsTop) {
          console.log('here')
          this.homePlayers[0] = playerId
        } else {
          this.homePlayers[1] = playerId
        }
      } else {
        if (this.playerPickerIsTop) {
          this.awayPlayers[0] = playerId
        } else {
          this.awayPlayers[1] = playerId
        }
      }
      let gameData = {
        gameNo: this.props.gameNo,
        homePlayers: this.homePlayers,
        awayPlayers: this.awayPlayers,
        setNo: this.props.setNo,
        winner: this.winner
      }
      this.props.setGameData(gameData)  
    }
  }

  setWinner(winner) {
    if (this.winner == winner) {
      winner = 'na'
    }
    this.winner = winner
    let gameData = {
      gameNo: this.props.gameNo,
      homePlayers: this.homePlayers,
      awayPlayers: this.awayPlayers,
      setNo: this.props.setNo,
      winner: this.winner
    }
    this.props.setGameData(gameData)
  }

  closePlayerPicker() {
    this.setState({
      showPlayerPicker: false    
    })
  }

  closeAddNewPlayerModal() {
    this.setState({
      showAddNewPlayerModal: false
    })
  }

  render() {
    let homeA = ''
    let homeB = ''
    let awayA = ''
    let awayB = ''
    if (typeof this.props.gameData[this.props.gameNo] == 'undefined' || !this.props.gameData[this.props.gameNo]) {
      this.homePlayers = [-1, -1]
      this.awayPlayers = [-1, -1]
    } else {
      this.homePlayers = this.props.gameData[this.props.gameNo].homePlayers
      this.awayPlayers = this.props.gameData[this.props.gameNo].awayPlayers
      this.winner = this.props.gameData[this.props.gameNo].winner
    }
    if (this.homePlayers[0] == -1) {
      homeA = 'Choose Player'
    } else {
      homeA = this.props.players.getPlayer(this.homePlayers[0]).playerName
    }
    if (this.homePlayers[1] == -1) {
      homeB = 'Choose Player'
    } else {
      homeB = this.props.players.getPlayer(this.homePlayers[1]).playerName
    }
    if (this.awayPlayers[0] == -1) {
      awayA = 'Choose Player'
    } else {
      awayA = this.props.players.getPlayer(this.awayPlayers[0]).playerName
    }
    if (this.awayPlayers[1] == -1) {
      awayB = 'Choose Player'
    } else {
      awayB = this.props.players.getPlayer(this.awayPlayers[1]).playerName
    }
    return (
      <View>
        <View>
          <View style={{flex: 1, flexDirection: 'row', borderWidth:1, borderStyle:'solid', paddingTop:5, paddingBottom: 5}}>
            <View style={styles.gameNo}>
              <Text>{this.props.gameNo}</Text>
            </View>
            <View style={{flex:1, flexDirection:'column'}}>
            {this.props.type==2 && 

                <View style={{flex: 0, flexGrow: 0}}>
                  <TouchableHighlight onPress={() => this.choosePlayer(true, true)}>
                    <Text style={styles.playerFont}>{homeA}</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={() => this.choosePlayer(true, false)}>
                    <Text style={styles.playerFont}>{homeB}</Text>
                  </TouchableHighlight>
                </View>

            }
            {this.props.type==1 && 
              <View style={{flex: 0, flexGrow: 0, height:50}}>
                <TouchableHighlight onPress={() => this.choosePlayer(true, true)}>
                  <Text style={styles.playerFont}>{homeA}</Text>
                </TouchableHighlight>
              </View>
            }
            </View>

            <TouchableHighlight style={styles.winLoseHome} onPress={() => this.setWinner('home')}>
              <View>
                {this.winner == 'home' &&
                  <Text style={styles.checkMark}>&#10060;</Text>
                }
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.winLoseAway} onPress={() => this.setWinner('away')}>
              <View>
                {this.winner == 'away' &&
                  <Text style={styles.checkMark}>&#10060;</Text>
                }
              </View>
            </TouchableHighlight>

            <View style={{flex: 1, flexDirection: 'column'}}>
            {this.props.type==1 && 
              <View style={{flex: 0, flexGrow: 0, marginLeft: 'auto', paddingRight:5}}>
                <TouchableHighlight onPress={() => this.choosePlayer(false, true)}>
                  <Text style={{textAlign:'right'}, styles.playerFont}>{awayA}</Text>
                </TouchableHighlight>
              </View>
            }          
            {this.props.type==2 && 
              <View style={{flex: 0, flexGrow: 0, marginLeft: 'auto', paddingRight:5}}>
                <TouchableHighlight onPress={() => this.choosePlayer(false, true)}>
                  <Text style={{textAlign:'right'}, styles.playerFont}>{awayA}</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.choosePlayer(false, false)}>
                  <Text style={{textAlign:'right'}, styles.playerFont}>{awayB}</Text>
                </TouchableHighlight>
              </View>
            }
            </View>
          </View>
        </View>
      {this.state.showPlayerPicker &&
        <PlayerPicker 
          closePlayerPicker={this.closePlayerPicker}
          setPlayer={this.setPlayer} 
          isTop={this.playerPickerIsTop} 
          isHome={this.playerPickerIsHome} 
          team={this.playerPickerTeam} 
          players={this.props.players}
          showAddPlayer={this.showAddPlayer}
        />
      }
      {this.state.showAddNewPlayerModal && 
        <AddPlayer
          closeAddPlayer={this.closeAddNewPlayerModal}
          isTop={this.playerPickerIsTop}
          isHome={this.playerPickerIsHome}
          team={this.playerPickerTeam}
          players={this.props.players}
          addNewPlayer={this.addNewPlayer}
          nameSearch={this.props.nameSearch}
        />
      }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  winLoseHome: {
    width: 50,
    backgroundColor: 'green',
    flexShrink: 0,
    flexGrow: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winLoseAway: {
    width: 50,
    backgroundColor: '#7DF9FF',
    flexShrink: 0,
    flexGrow: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameNo: {
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: 20
  },
  playerFont: {
    fontSize: 18,  
  },
  checkMark: {
    fontSize: 28,
    fontWeight:'bold'
  }
})

export default Game