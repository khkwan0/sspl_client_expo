import React, { Component } from 'react'
import { ScrollView, Text, View, Picker, Button } from 'react-native'
import { StackNavigator } from 'react-navigation'
import PlayerPicker from './PlayerPicker'
import SetBlock from './SetBlock'
import AddPlayer from './AddPlayer'

class ScoreSheet extends Component {
  static navigationOptions = {
    title: 'New Game',
  };

  constructor(props) {
    super(props);

    this.setPlayer = this.setPlayer.bind(this)
    this.createArray = this.createArray.bind(this)
    this.initializePlayers = this.initializePlayers.bind(this)
    this.showPlayerPicker = this.showPlayerPicker.bind(this)
    this.showAddPlayer = this.showAddPlayer.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.addTeamMember = this.addTeamMember.bind(this)

    var homePlayerArray = this.createArray(37, 2)
    var awayPlayerArray = this.createArray(37, 2)
    homePlayerArray = this.initializePlayers(homePlayerArray)
    awayPlayerArray = this.initializePlayers(awayPlayerArray)

    this.matchData = this.props.navigation.state.params.matchData

    this.state = {
      homePlayers: homePlayerArray,
      awayPlayers: awayPlayerArray,
      buttonMetaData: {},
      pickerTeam: '',
      showAddPlayer: false
    }
  }

  initializePlayers(arr) {
    i = arr.length;
    while (--i > -1) {
      arr[i][0] = {playerId: -1};
      arr[i][1] = {playerId: -1};
    }
    return arr
  }

  createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
    }
    return arr;
  }

  setPlayer(buttonState, playerId) {
    isHomeTeam = buttonState.isHome;
    isDoubles = buttonState.isDoubles;
    theGameNo = buttonState.gameNo;
    isTopPlayer = buttonState.onTop;

    if (isHomeTeam) {  // home team
      var newArray = this.state.homePlayers;
      if (!isDoubles) {  // singles game
        newArray[theGameNo][0].playerId = playerId
      } else {  // doubles game
        if (isTopPlayer) {
          newArray[theGameNo][0].playerId = playerId
        } else {
          newArray[theGameNo][1].playerId = playerId
        }      
      }
      this.matchData.homeTeam = newArray
      this.setState({
        homePlayers: newArray,
        pickerTeam: '',
      })
    } else { // away team
      var newArray = this.state.awayPlayers;
      if (!isDoubles) {  // singles game
        newArray[theGameNo][0].playerId = playerId        
      } else {  // doubles game
        if (isTopPlayer) {
          newArray[theGameNo][0].playerId = playerId          
        } else {
          newArray[theGameNo][1].playerId = playerId
        }      
      }
      this.matchData.awayTeam = newArray
      this.setState({
        awayPlayers:newArray,
        pickerTeam: '',
      })
    }
  }

  showPlayerPicker(buttonMetaData) {
    team = 'away'
    if (buttonMetaData.isHome) {
      team = 'home'
    }
    if (team == 'away') {
      this.team = this.props.navigation.state.params.awayTeam
    } else {
      this.team = this.props.navigation.state.params.homeTeam
    }
    this.setState({
      pickerTeam: team,
      buttonMetaData: buttonMetaData
    })
  }

  showAddPlayer(buttonMetaData) {
    this.setState({
      pickerTeam:'',
      showAddPlayer: true,
      buttonMetaData: buttonMetaData
    })
  }

  closeModal() {
    this.setState({
      pickerTeam: '',
      showAddPlayer: false
    })
  }

  addTeamMember(buttonMetaData, playerName) {
    players = this.props.navigation.state.params.players
    player = players.addNewPlayer(playerName)
    if (buttonMetaData.isHome) {
      team = this.props.navigation.state.params.homeTeam      
    } else {
      team = this.props.navigation.state.params.awayTeam
    }
    team.addPlayer(player.playerId)
    console.log(teams)
    this.setPlayer(buttonMetaData, player.playerId)    
  }

  render() {
    matchData = this.props.navigation.state.params.matchData
    homeTeamData = this.props.navigation.state.params.homeTeam
    awayTeamData = this.props.navigation.state.params.awayTeam
    playerData = this.props.navigation.state.params.players
    return (
      <ScrollView>
        <View>
          <View>
          <Text>{matchData.matchDate.toDateString()}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text>Home: {homeTeamData.teamName}</Text>
            <Text>Away: {awayTeamData.teamName}</Text>
          </View>
          <View style={{paddingTop: 10, paddingBottom: 10, backgroundColor:'black'}}>          
            <Text style={{color:'white', fontWeight:'bold', textAlign:'center'}}>Doubles</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor:'black', paddingTop:10, paddingBottom: 10, justifyContent:'space-between'}}>
            <View>
              <Text style={{color: 'white'}}>{homeTeamData.teamName}</Text>
            </View>
            <View>
              <Text style={{color: 'white'}}>{awayTeamData.teamName}</Text>
            </View>
          </View>
          <SetBlock startingGameNo={1} teamType='doubles' showPlayerPicker={this.showPlayerPicker} playerData={playerData} homeTeam={this.state.homePlayers} awayTeam={this.state.awayPlayers} />
          <View style={{paddingTop: 10, paddingBottom: 10, backgroundColor:'black'}}>          
            <Text style={{color:'white', fontWeight:'bold', textAlign:'center'}}>Singles</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor:'black', paddingTop:10, paddingBottom: 10, justifyContent:'space-between'}}>
            <View>
              <Text style={{color: 'white'}}>{homeTeamData.teamName}</Text>
            </View>
            <View>
              <Text style={{color: 'white'}}>{awayTeamData.teamName}</Text>
            </View>
          </View>
          <SetBlock startingGameNo={5} teamType='singles' showPlayerPicker={this.showPlayerPicker} playerData={playerData} homeTeam={this.state.homePlayers} awayTeam={this.state.awayPlayers}/>
        </View>
        {this.state.pickerTeam != '' &&          
          <PlayerPicker teamData={this.team} players={playerData} setPlayer={this.setPlayer} buttonState={this.state.buttonMetaData} showAddPlayer={this.showAddPlayer} closeModal={this.closeModal} />
        }    
        {this.state.showAddPlayer &&
          <AddPlayer buttonMetaData={this.state.buttonMetaData} closeModal={this.closeModal} addTeamMember={this.addTeamMember} />
        }
      </ScrollView>
    )
  }
}

export default ScoreSheet