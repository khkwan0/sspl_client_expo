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
    let matchPointsAway = 0
    let matchPointsHome = 0
    let homeSetPoints = 0
    let awaySetPoints = 0

    if (typeof this.props.matchPointsAway != 'undefined' && typeof this.props.matchPointsHome != 'undefined') {
      matchPointsAway = this.props.matchPointsAway
      matchPointsHome = this.props.matchPointsHome
    }
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
          myTeamId={this.props.myTeamId}
        />
        )
    }
    let gameType = ''
    if (this.props.gameType == 'm_eight') {
      gameType = 'Eight Ball'
    }
    if (this.props.gameType == 'm_nine') {
      gameType = 'Nine Ball'
    }
    if (this.props.gameType == 'm_wild') {
      gameType = 'Wildcard'
    }
    let points = ''

    if ((setScoreHome + setScoreAway) == this.props.numGames) {  // set is complete.  all games played in set
      if (this.props.gameType == 'eight') {
        if (this.props.type == 1) {  // singles
          if (setScoreHome > setScoreAway) {
            homeSetPoints = 3
          } else {
            awaySetPoints = 3
          }
        } else {  //doubles
          if (setScoreHome == setScoreAway) {
            homeSetPoints = 1
            awaySetPoints = 1
          } else if (setScoreHome > setScoreAway) {
            homeSetPoints = 2
          } else {
            awaySetPoints = 2
          }          
        }
      }
      if (this.props.gameType == 'm_eight' || this.props.gameType == 'm_nine') {
        if (this.props.type == 1) {
          if (setScoreHome > setScoreAway) {
            homeSetPoints = 3
          } else {
            awaySetPoints = 3
          }
        } else {
          if (setScoreHome == setScoreAway) {
            homeSetPoints = 1
            awaySetPoints = 1
          } else if (setScoreHome > setScoreAway) {
            homeSetPoints = 2
          } else {
            awaySetPoints = 2
          }
        }
      }
      if (this.props.gameType == 'm_wild') {
        if (setScoreHome > setScoreAway) {
          homeSetPoints = 5
        } else {
          awaySetPoints = 5
        }
      }
    }
    if (this.props.gameType != 'nine') {
      points = (
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <View>
            <Text>Total: </Text>
            <Text>
              {matchPointsHome}
            </Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{homeSetPoints}</Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{awaySetPoints}</Text>
          </View>
          <View>
            <Text>Total: </Text>
            <Text>
              {matchPointsAway}
            </Text>
          </View>
        </View>
      )
    }
    return(
      <View>
        <View style={{paddingTop: 10, paddingBottom: 10, backgroundColor:'black'}}>          
          <Text style={{color:'white', fontWeight:'bold', textAlign:'center'}}>{setType}</Text>
        </View>
        <View style={{backgroundColor:'black'}}>
          <Text style={{color:'white', fontWeight:'bold', textAlign:'center'}}>{gameType}</Text>
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
        <View>
          <Text>Points:</Text>
        </View>        
        <View>
          {points}
        </View>
        <View>
          <Text>Games</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', justifyContent:'center'}}>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Text>
              Total:
            </Text>
            <Text style={{fontSize:24}}>
              {matchScoreHome}
            </Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{setScoreHome}</Text>
          </View>
          <View style={styles.setScoreView}>
            <Text style={styles.setScoreText}>{setScoreAway}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <Text>
              Total:
            </Text>
            <Text style={{fontSize: 24}}>
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