import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import ChoosePlayerButton from './ChoosePlayerButton'

class SetBlock extends Component {

  constructor(props) {
    super(props)
    this.chooseWinner = this.chooseWinner.bind(this)
  }

  chooseWinner(isHome, gameNo) {
    console.log(gameNo + ' ' + isHome)
  }

  render() {
    var rows = []
    players = this.props.playerData
    if (this.props.teamType == 'doubles') {
      for (let i = this.props.startingGameNo; i < this.props.startingGameNo + 4; i++) {
        var xkey = 'doubles' + i
        var homePlayerNameA = homePlayerNameB = awayPlayerNameA = awayPlayerNameB = 'Choose Player'
        if (this.props.homeTeam[i][0].playerId != -1) {
          homePlayerNameA = players.getPlayer(this.props.homeTeam[i][0].playerId).playerName
        }
        if (this.props.homeTeam[i][1].playerId != -1) {
          homePlayerNameB = players.getPlayer(this.props.homeTeam[i][1].playerId).playerName
        }
        if (this.props.awayTeam[i][0].playerId != -1) {        
          awayPlayerNameA = players.getPlayer(this.props.awayTeam[i][0].playerId).playerName
        }
        if (this.props.awayTeam[i][1].playerId != -1) {
          awayPlayerNameB = players.getPlayer(this.props.awayTeam[i][1].playerId).playerName
        }
        rows.push(
          <View key={xkey} style={{flex: 1, flexDirection: 'row', borderWidth:1, borderStyle:'solid'}}>
            <View style={styles.gameNo}>
              <Text>{i}</Text>
            </View>
            <View style={{flex:1, flexDirection: 'column'}}>
              <View style={{flex: 0, flexGrow: 0}}><ChoosePlayerButton isHome={true} gameNo={i} isDoubles={true} onTop={true} playerName={homePlayerNameA} showPlayerPicker={this.props.showPlayerPicker} /></View>
              <View style={{flex: 0, flexGrow: 0}}><ChoosePlayerButton isHome={true} gameNo={i} isDoubles={true} onTop={false} playerName={homePlayerNameB} showPlayerPicker={this.props.showPlayerPicker} /></View>
            </View>
            <TouchableHighlight onPress={() => this.chooseWinner(true, i)} style={styles.winLose}><View></View></TouchableHighlight>
            <TouchableHighlight onPress={() => this.chooseWinner(false, i)} style={styles.winLose}><View></View></TouchableHighlight>
            <View style={{flex:1, flexDirection: 'column'}}>
              <View style={{flex: 0, flexGrow: 0}}><ChoosePlayerButton isHome={false} gameNo={i} isDoubles={true} onTop={true} playerName={awayPlayerNameA} showPlayerPicker={this.props.showPlayerPicker} /></View>
              <View style={{flex: 0, flexGrow: 0}}><ChoosePlayerButton isHome={false} gameNo={i} isDoubles={true} onTop={false} playerName={awayPlayerNameB} showPlayerPicker={this.props.showPlayerPicker} /></View>
            </View>
          </View>      
        );
      }
    }
    if (this.props.teamType == 'singles') {
      for (let i = this.props.startingGameNo; i < this.props.startingGameNo + 8; i++) {
        var xkey = 'singles' + i
        var homePlayerName = 'Choose Player'
        var awayPlayerName = 'Choose Player'
        if (this.props.homeTeam[i][0].playerId != -1) {
          homePlayerName = this.getPlayerDataFromPlayerId(this.props.homeTeam[i][0].playerId).playerName
        }
        if (this.props.awayTeam[i][0].playerId != -1) {
          awayPlayerName = this.getPlayerDataFromPlayerId(this.props.awayTeam[i][0].playerId).playerName
        }
        rows.push(
          <View key={xkey} style={{flex: 1, flexDirection: 'row', borderWidth:1, borderStyle:'solid'}}>
            <View style={styles.gameNo}>
                <Text>{i}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <View>
                <ChoosePlayerButton isHome={true} gameNo={i} isDoubles={false} onTop={false} playerName={homePlayerName} showPlayerPicker={this.props.showPlayerPicker} />
              </View>
            </View>
            <TouchableHighlight onPress={() => this.chooseWinner(true, i)} style={styles.winLose}><View></View></TouchableHighlight>
            <TouchableHighlight onPress={() => this.chooseWinner(false, i)} style={styles.winLose}><View></View></TouchableHighlight>
            <View style={{flex: 1, flexDirection:'column'}}>
              <View>
                <ChoosePlayerButton isHome={true} gameNo={i} isDoubles={false} onTop={false} playerName={awayPlayerName} showPlayerPicker={this.props.showPlayerPicker} />
              </View>
            </View>
          </View>
        )
      }
    }
    return (
      <View>
        {rows}
      </View>
    )
  }
}      

const styles = StyleSheet.create({
  winLose: {
    width: 50,
    backgroundColor: 'green'
  },
  gameNo: {
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: 17
  }
}) 

export default SetBlock