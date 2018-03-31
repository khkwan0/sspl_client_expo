import React, {Component} from 'react'
import {ScrollView, Text, View} from 'react-native'

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
          <View key={key} style={{borderRadius:10, borderWidth: 1}}>
            <View>
              <Text>
                {matchDate}
              </Text>
            </View>
            <View>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                {awayTeam.teamName} VS @{homeTeam.teamName}
              </Text>
          </View>
        </View>
        )
      }
    }
    return(      
      <ScrollView>
        {rows}
      </ScrollView>
    )
  }
}

export default BrowseTeamMatches