import React, {Component} from 'react'
import {ScrollView, Text, View, TouchableHighlight, ImageBackground} from 'react-native'

class BrowseTeamMatches extends Component {

  static navigationOptions = ({ navigation }) => {
    const {params} = navigation.state
    return {title: params.otherParam}
  }

  constructor(props) {
    super(props)    
    this.teams = this.props.navigation.state.params.teams
    this.matches = this.props.navigation.state.params.matches

    let chosenIndex = this.props.navigation.state.params.chosenIndex
    this.props.navigation.setParams({otherParam: chosenIndex.type == 'team'? this.teams.getTeam(chosenIndex.teamId).teamName : new Date(chosenIndex.date).toDateString()})

    this.showMatch = this.showMatch.bind(this)
  }

  showMatch(matchData, homeTeam, awayTeam) {
    matchData.matchDate = new Date(matchData.matchDate)
    this.props.navigation.navigate('Match', {matchData: matchData, homeTeam: homeTeam, awayTeam: awayTeam, myTeamId: this.props.navigation.state.params.myTeamId})
  }

  render() {
    let rows = []
    let chosenIndex = this.props.navigation.state.params.chosenIndex

    let matches = chosenIndex.type == 'team'? this.matches[chosenIndex.teamId] : this.matches[chosenIndex.date]
    //console.log(this.matches)
    for (let key in matches) {
      let match = matches[key]
      let htid = match.homeTeamId
      let atid = match.awayTeamId
      let awayTeam = this.teams.getTeam(atid)
      let homeTeam = this.teams.getTeam(htid)
      matchDate = new Date(match.matchDate).toDateString()
      if (awayTeam && homeTeam) {
        rows.push(
          <View key={key} style={{borderColor: 'white', borderRadius:10, borderWidth: 1}}>
            <TouchableHighlight onPress={()=>this.showMatch(match, homeTeam, awayTeam)}>
              <View>
                <Text style={{color: 'white'}}>
                  {matchDate}
                </Text>
                <Text style={{color: 'white', fontSize:26, paddingLeft:10, paddingRight:10}}>
                  {awayTeam.teamName} VS @{homeTeam.teamName}
                </Text>
            </View>
            </TouchableHighlight>
          </View>
        )
      }
    }
    return(
      <ImageBackground source={require('../assets/chalk.png')} style={{width: '100%', height: '100%'}}>
        <ScrollView>
          {rows}
        </ScrollView>
      </ImageBackground>
    )
  }
}

export default BrowseTeamMatches