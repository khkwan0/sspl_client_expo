import React, {Component} from 'react'
import {ScrollView, View, Text, TouchableHighlight, ImageBackground} from 'react-native'
import BrowseTeamMatches from './BrowseTeamMatches';

class BrowseMatches extends Component {

  static navigationOptions = {
    title: 'Browse Matches'    
  }

  constructor(props) {
    super(props)

    this.groupBy = this.props.navigation.state.params.groupBy
    this.teams = this.props.navigation.state.params.teams
    this.matchData = this.props.navigation.state.params.matches

    this.groupMatchDataByDate = this.groupMatchDataByDate.bind(this)
    this.groupMatchDataByTeam = this.groupMatchDataByTeam.bind(this)
    this.browseTeamMatches = this.browseTeamMatches.bind(this)
    this.browseDateMatches = this.browseDateMatches.bind(this)

    this.state = {
      groupBy: this.groupBy,    
      matchesByTeams: null,
      matchesByDates: null
    }
  }

  componentDidMount() {
    if (this.state.groupBy == 'team') {
      this.groupMatchDataByTeam()
    }
    if (this.state.groupBy == 'date') {
      this.groupMatchDataByDate()
    }
  }

  groupMatchDataByTeam() {
    newArray = {}
    console.log('groupmatchdatabyteam')
    for (let key in this.matchData) {
      homeTeamId = this.matchData[key].homeTeamId
      awayTeamId = this.matchData[key].awayTeamId
      if (typeof newArray[homeTeamId] === 'undefined') {        
        newArray[homeTeamId] = []      
      }
      newArray[homeTeamId].push(this.matchData[key])
      if (typeof newArray[awayTeamId] === 'undefined') {
        newArray[awayTeamId] =[]
      }
      newArray[awayTeamId].push(this.matchData[key])
    }
    this.setState({
      matchesByTeams: newArray
    })
  }

  groupMatchDataByDate() {
    newArray = {}
    console.log('group match data by date')
    for (let key in this.matchData) {
      matchDate = this.matchData[key].matchDate
      if (typeof newArray[matchDate] == 'undefined') {
        newArray[matchDate] = []
      }
      newArray[matchDate].push(this.matchData[key])
    }
    this.setState({
      matchesByDates: newArray
    })
  }

  browseTeamMatches(index) {    
    chosenTeam = this.teams.getTeams()[index]
    this.props.navigation.navigate('BrowseTeamMatches', {teams: this.teams, matches: this.state.matchesByTeams, chosenIndex: {type: 'team', teamId: chosenTeam.teamId}, myTeamId: this.props.navigation.state.params.myTeamId})
  }

  browseDateMatches(aDate) {
    console.log(aDate)
     this.props.navigation.navigate('BrowseTeamMatches', {teams: this.teams, matches: this.state.matchesByDates, chosenIndex: {type: 'date', date: aDate}, myTeamId: this.props.navigation.state.params.myTeamId})
  }

  render() {
    rows = []
    if (this.state.groupBy == 'team') {
      for(let key in this.teams.getTeams()) {
        rows.push(
          <TouchableHighlight key={this.teams.getTeams()[key].teamName} onPress={()=>this.browseTeamMatches(key)} style={{paddingTop:10}}>
            <View style={{borderColor:'white', borderRadius:10, borderWidth: 1}}>
              <Text style={{color:'white', fontSize:26, paddingLeft:10, paddingRight:10}}>
                {this.teams.getTeams()[key].teamName}    
              </Text>
            </View>
          </TouchableHighlight>
        )
      }
    }
    if (this.state.groupBy == 'date') {
     for (let aDate in this.state.matchesByDates) {
       rows.push(
        <TouchableHighlight key={aDate} onPress={()=>this.browseDateMatches(aDate)} style={{paddingTop:10}}>
          <View style={{borderColor:'white',borderRadius:10, borderWidth: 1}}>
            <Text style={{color: 'white', fontSize:26, paddingLeft:10, paddingRight:10}}>
              {new Date(aDate).toDateString()}    
            </Text>
          </View>
        </TouchableHighlight>
       )
     } 
    }
    return(
      <ImageBackground source={require('../assets/bridge.png')} style={{width:'100%', height: '100%'}}>
        <ScrollView>
          {rows}
        </ScrollView>
      </ImageBackground>
    )
  }
}

export default BrowseMatches