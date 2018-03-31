import React, {Component} from 'react'
import {View, Button, Text, AsyncStorage, TouchableHighlight, Modal} from 'react-native'
import Team from './Team'
import Teams from './Teams'
import Player from './Player'
import Players from './Players'
import ChooseTeam from './ChooseTeam'
import Config from './Config'

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props)    

    this.scoreSheetsBtnHandler = this.scoreSheetsBtnHandler.bind(this)
    this.archivesBtnHandler = this.archivesBtnHandler.bind(this)
    this.otherMatchesBtnHandler = this.otherMatchesBtnHandler.bind(this)
    this.setTeam = this.setTeam.bind(this)
    this.getSeasonData = this.getSeasonData.bind(this)
    this.getSeasonFromLocal = this.getSeasonFromLocal.bind(this)
    this.getSeasonFromRemote = this.getSeasonFromRemote.bind(this)
    this.changeTeamHandler = this.changeTeamHandler.bind(this)
    this.getAppData = this.getAppData.bind(this)

    this.getTeams = this.getTeams.bind(this)
    this.getTeamsFromRemote = this.getTeamsFromRemote.bind(this)
    this.getMyTeam = this.getMyTeam.bind(this)

    this.state = {
      teamID: -1,
      teamName: '',
      teams: null,
      players: this.players,      
      serverAlive: true,
    }
  }

  changeTeamHandler() {
    AsyncStorage.removeItem('myTeam')
    .then(() => {
      this.getAppData()
    })
    .catch((err) => {
      console.log(err)
    })
    
  }

  getTeams() {
    console.log('get teams from local')  
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('teams')
      .then((teamsStr) => {
        if (teamsStr) {
          try {
            teams = JSON.parse(teamsStr)
            if (teams.length) {
              teamsObj = new Teams()
              for (let i = 0; i < teams.length; i++) {
                teamsObj.add(new Team(teams[i]))
              }
              resolve(teamsObj)
            }
          } catch (err) {
            //console.log(err)
            reject(err)
          }
        } else {
          reject('no string')
        }
      })
      .catch((err) => {
        reject(err)
      })      
    })
  }

  getTeamsFromRemote() {
    console.log('get teams from remote')
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/teams/' + Config.season)
      .then((results) => results.json())
      .then((resultJson) => {
        teams = resultJson
        if (teams.length) {
          AsyncStorage.setItem('teams', JSON.stringify(teams))
          teamsObj = new Teams()
          for (let i = 0; i < teams.length; i++) {
            teamsObj.add(new Team(teams[i]))
          }
          resolve(teamsObj)
        } else {
          reject(null)
        }
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  getSeasonFromLocal() {
    console.log('get season data from local')
    return new Promise((resolve, reject) => {
      if (Config.disableLocalSave) {
        reject('local store disabled')
      } else {
        AsyncStorage.getItem(Config.seasonDataLocalStorageKey)
        .then((seasonDataStr) => {
          seasonData = JSON.parse(seasonDataStr)
          if (typeof seasonData.season != 'undefined' && typeof seasonData.seasonExpireDate != 'undefined' && seasonData.seasonExpireDate) {
            today = new Date()
            expireDate = new Date(seasonData.seasonExpireDate)
            if (today.getTime() > expireDate.getTime()) {
              reject('cached season data is expired')
            } else {
              resolve(seasonData)
            }
          } else {
            reject('no local data')
          }
        })
        .catch((err) => {
          reject(err)
        })
      }
    })
  }

  getSeasonFromRemote() {
    console.log('get season data from remote')
    return new Promise((resolve, reject) => {
      fetch(Config.server +'/seasondata')
      .then((result) => result.json())
      .then((resultJson) => {
        if (typeof resultJson.season != 'undefined') {
          AsyncStorage.setItem(Config.seasonDataLocalStorageKey, JSON.stringify(resultJson))
          resolve(resultJson)
        } else {
          reject('malformed season data from server')
        }
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  getSeasonData() {
    console.log('get season data')
    return new Promise((resolve, reject) => {
      this.getSeasonFromLocal()
      .then((seasonData) => {
        resolve(seasonData)
      })
      .catch((err) => {
        console.log(err)
        this.getSeasonFromRemote()
        .then((seasonData) => {
          resolve(seasonData)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
      })
    })
  }

  getAppData() {
    this.getSeasonData()
    .then((seasonData) => {
      Config.season = seasonData.season
      if (Config.disableLocalSave) {
        this.getTeamsFromRemote()
        .then((teams) => {
          this.teams = teams
          this.getMyTeam()
        })
        .catch((err) => {
          if (err) {
            console.log(err)
          }
        })
      } else {
        this.getTeams()
        .then((teams) => {
          this.teams = teams
          this.getMyTeam()
        })
        .catch((err) => {
          if (err) {
            console.log(err)
          }
          this.getTeamsFromRemote()
          .then((teams) => {
            this.teams = teams
            this.getMyTeam()
          })
          .catch((err) => {
            if (err) {
              console.log(err)
            }
          })
        })
      }
    })
    .catch((err) => {
      console.log(err)
      console.log('NO SEASON DATA')
    })   
  }

  componentWillMount() {
    this.getAppData()
  }

  getMyTeam() {
    AsyncStorage.getItem('myTeam')
    .then((teamInfoStr) => {
      teamInfo = JSON.parse(teamInfoStr)    
      if (!teamInfo || teamInfo.teamId == null || typeof teamInfo.teamId == 'undefined' || teamInfo.teamId < 0) {
        this.props.navigation.navigate('ChooseTeam', {setTeam: this.setTeam, teams: this.teams.getTeams()})        
      } else {
        this.setState({
          teamName: teamInfo.teamName,
          teamId: teamInfo.teamId,
          teams: this.teams
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })  
  }

  componentDidMount() {
    rv = false
    console.log('ping')
    fetch(Config.server + '/ping')
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson)
      if (responseJson.response == 'pong') {        
        console.log(responseJson.response)
        rv = true
      }
      this.setState({
        serverAlive: rv
      })
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        serverAlive: rv
      })
    })
  }

  scoreSheetsBtnHandler() {
    this.props.navigation.navigate('ScoreSheets', {teams: this.state.teams, myTeamId: this.state.teamId})
  }

  archivesBtnHandler() {
    this.props.navigation.navigate('Archives')
  }

  otherMatchesBtnHandler() {
    this.props.navigation.navigate('OtherMatches', { teams: this.state.teams, myTeamId: this.state.teamId})
  }

  setTeam(teamId) {
    AsyncStorage.setItem('myTeam', JSON.stringify({teamName: this.teams.getTeam(teamId).teamName, teamId: teamId})).
    then(() => {
      this.setState({
        teamName: this.teams.getTeam(teamId).teamName,
        teamId: teamId,
        teams: this.teams
      })
    })
  }

  render() {
    const team = this.state.teamName
    return (
      <View style={{flex: 1, flexDirection:'column'}}>
        {!this.state.serverAlive &&      
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
            <View>
              <Text style={{backgroundColor:'red', color: 'white'}}>Server is currently down.  Data will be saved on your device</Text>
            </View>
          </View>
        }
        <View style={{flex: 1, justifyContent:'flex-start', alignItems:'center',marginTop:100}}>
          <Text style={{fontSize: 24}}>Team: {team}</Text>      
        </View>
        <View style={{flex: 1, justifyContent:'flex-start', alignItems:'center'}}>
          <TouchableHighlight onPress={this.scoreSheetsBtnHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Score Sheets
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.otherMatchesBtnHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Browse Matches
              </Text>
            </View>
          </TouchableHighlight>          
          <TouchableHighlight onPress={this.archivesBtnHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Archives
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.changeTeamHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Change Team
              </Text>
            </View>
          </TouchableHighlight>          
        </View>
      </View>
    )
  }
}

export default HomeScreen