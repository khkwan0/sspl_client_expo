import React, {Component} from 'react'
import {View, Picker, TouchableHighlight, Text} from 'react-native'

class ChooseTeam extends Component {
  constructor(props) {
    super(props)

    this.selectTeam = this.selectTeam.bind(this)
    this.submitTeam = this.submitTeam.bind(this)

    this.state = {
      teamId: 'xxxoooxxxooo'
    }
  }

  selectTeam(teamId) {
    this.setState({
      teamId: teamId
    })
  }

  submitTeam() {
    if (this.state.teamId != "xxxoooxxxooo") {
      this.props.navigation.state.params.setTeam(this.state.teamId)
      this.props.navigation.goBack()
    }

    //console.log(this.state.teamId)
  }

  render() {
    let teams = this.props.navigation.state.params.teams
    let teamDisplay = []
    if (teams) {
      let i = 0
      while (i < teams.length) {
        teamDisplay.push(
          <Picker.Item key={i} label={teams[i].teamName} value={teams[i].teamId} />
        )
        i++
      }
    }
    return(
      <View>
        <View>
          <View>
            <View>
              <TouchableHighlight onPress={this.submitTeam}>
                <Text style={{backgroundColor:'gray', paddingRight:10, fontSize:18}}>Done</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <Picker selectedValue={this.state.teamId} onValueChange={this.selectTeam}>
              <Picker.Item label="Select Team" value="xxxoooxxxooo" />
              {teamDisplay}
            </Picker>
          </View>
        </View>
      </View>
    )
  }
}

export default ChooseTeam