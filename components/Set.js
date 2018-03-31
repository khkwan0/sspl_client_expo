import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Game from './Game'

class Set extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: this.props.type,
    }
  }

  render() {
    let setType = ''
    if (this.state.type == 1) {
      setType = 'Singles'
    } else {
      setType = 'Doubles'
    }
    let rows = []      
    let setScoreHome = 0
    let setScoreAway = 0
    let matchScoreHome = 0
    let matchScoreAway = 0
    for (let i = 0; i<(this.props.startingGameNo + this.props.numGames); i++) {
      if (typeof this.props.gameData[i] !== 'undefined' && this.props.gameData[i]) {
        if (this.props.gameData[i].winner == 'home') {
          matchScoreHome++
        }
        if (this.props.gameData[i].winner == 'away') {
          matchScoreAway++
        }
      }
    }
    for (let i = 0; i < this.props.numGames; i++) {
      if (typeof this.props.gameData[this.props.startingGameNo + i] !== 'undefined' && this.props.gameData[this.props.startingGameNo + i]) {
        if (this.props.gameData[this.props.startingGameNo + i].winner == 'home') {
          setScoreHome++
        }
        if (this.props.gameData[this.props.startingGameNo + i].winner == 'away') {
          setScoreAway++
        }
      }
      rows.push(
        <Game 
          setGameData={this.props.setGameData}
          players={this.props.players}
          gameData={this.props.gameData}
          awayTeam={this.props.awayTeam}
          homeTeam={this.props.homeTeam}
          key={this.props.setNumber + '_' + i}
          type={this.state.type}
          setNo={this.props.setNumber}
          gameNo={this.props.startingGameNo + i}
          isComplete={this.props.isComplete} 
          nameSearch={this.props.nameSearch}
        />
        )
    }
    return(
      <View>
        <View style={{paddingTop: 10, paddingBottom: 10, backgroundColor:'black'}}>          
          <Text style={{color:'white', fontWeight:'bold', textAlign:'center'}}>{setType}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor:'black', paddingTop:10, paddingBottom: 10, justifyContent:'space-between'}}>
          <View>
            <Text style={{color: 'white'}}>{this.props.homeTeam.teamName}</Text>
          </View>
          <View>
            <Text style={{color: 'white'}}>{this.props.awayTeam.teamName}</Text>
          </View>
        </View>
        <View>  
          {rows}
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
          <View>
            <Text>
              {matchScoreHome}
            </Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{setScoreHome}</Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{setScoreAway}</Text>
          </View>
          <View>
            <Text>
              {matchScoreAway}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  setScoreView: {
    borderWidth:1,
    flexBasis: 50
  },
  setScoreText: {
    fontSize: 24,
    textAlign:'center'
  }
})
export default Set