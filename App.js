import React, {Component} from 'react'
import { StackNavigator } from 'react-navigation'
import ScoreSheets from './components/ScoreSheets'
import Archives from './components/Archives'
import HomeAwayPicker from './components/HomeAwayPicker'
import HomeScreen from './components/HomeScreen'
import ConfirmDate from './components/ConfirmDate'
import ChooseTeam from './components/ChooseTeam'
import Match from './components/Match'
import OtherMatches from './components/OtherMatches'
import BrowseMatches from './components/BrowseMatches'
import BrowseTeamMatches from './components/BrowseTeamMatches'

const RootStack = StackNavigator(
  {
    HomeScreen: { screen: HomeScreen},
    ScoreSheets: {screen: ScoreSheets},
    Archives: {screen: Archives},
    HomeAwayPicker: {screen: HomeAwayPicker},
    ConfirmDate: {screen: ConfirmDate},
    ChooseTeam: {screen:ChooseTeam},
    Match: {screen:Match},
    OtherMatches: {screen: OtherMatches},
    BrowseMatches: {screen: BrowseMatches},
    BrowseTeamMatches: {screen: BrowseTeamMatches}
  },
  {
    initialRouteName: 'HomeScreen'
  }  
)

class App extends Component {
  render() {
    return <RootStack />
  }
}
    
export default App