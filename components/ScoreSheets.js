import React, {Component} from 'react'
import {ScrollView, View, AsyncStorage, TouchableHighlight, Text, ActivityIndicator} from 'react-native'
import Config from './Config'

class ScoreSheets extends Component {
  static navigationOptions = {
    title: 'Score Sheets',
  };
  constructor(props) {
    super(props)

    this.getMatches = this.getMatches.bind(this)
    this.handleScoreSheetChosenBtn = this.handleScoreSheetChosenBtn.bind(this)
    this.handleCameBack = this.handleCameBack.bind(this)
    this.state = {
      matches: null,
      pressed: false
    }
    this.myTeamId = this.props.navigation.state.params.myTeamId
  }

  componentDidMount() {
    if (Config.disableLocalSave) {
      this.getMatches()
    } else {
      AsyncStorage.getItem('matches').
      then((matchesStr) => {      
        if (!matchesStr) {
          this.getMatches()
        } else {
          try {
            matches = JSON.parse(matchesStr)
            if (matches.expireDate == 'undefined' || !matches.expireDate) {
              this.getMatches()
            } else {
              today = new Date
              today.setHours(0,0,0,0)
              matches.expireDate = new Date(matches.expireDate)
              matches.expireDate.setHours(0,0,0,0)
              if (matches.expireDate < today) {
                this.getMatches()
              } else {
                for (let i = 0; i < matches.matches.length; i++) {
                  matches.matches[i].matchDate = new Date(matches.matches[i].matchDate)
                }
                console.log('get matches form local store')
                this.setState({
                  matches: matches.matches
                })
              }
            }
          }
          catch(err) {
            console.log(err)
            this.getMatches()
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }

  handleScoreSheetChosenBtn(matchData) {
    if (!this.state.pressed) {
      teams = this.props.navigation.state.params.teams  
      homeTeam = teams.getTeam(matchData.homeTeamId)
      awayTeam = teams.getTeam(matchData.awayTeamId)    
      console.log(matchData)
      this.setState({
        pressed: true
      })
      this.props.navigation.navigate('Match', {matchData: matchData, homeTeam: homeTeam, awayTeam: awayTeam, myTeamId: this.props.navigation.state.params.myTeamId, scoreSheetReset: this.handleCameBack})
    }
  }

  handleCameBack() {
    this.setState({
      pressed: false
    })
  }

  getMatches() {
    matches = []
    console.log('get matches from remote')
    fetch(Config.server + '/matches/' + Config.season)
    .then((response) => response.json())
    .then((responseJson) => {      
      for (let i = 0; i < responseJson.length; i++) {
        responseJson[i].matchId = responseJson[i]._id
        responseJson[i].matchDate = new Date(responseJson[i].matchDate)
      }
      matches = responseJson      
      expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + 7)
      AsyncStorage.setItem('matches', JSON.stringify({expireDate: expireDate, matches: matches}))
      this.setState({
        matches: matches
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  render() {
    var rows = []
    var today = new Date();
    teams = this.props.navigation.state.params.teams      
    players = this.props.navigation.state.params.players  
    today.setHours(0,0,0,0)
    if (this.state.matches) {
      this.state.matches.map((aMatch, i) => {
        aMatch.matchDate.setHours(0,0,0,0)
        homeTeam = teams.getTeam(aMatch.homeTeamId)        
        awayTeam = teams.getTeam(aMatch.awayTeamId)      
        if (awayTeam && homeTeam && aMatch.matchDate.toDateString() == today.toDateString() && (aMatch.homeTeamId == this.myTeamId || aMatch.awayTeamId == this.myTeamId)) {          
          var gameTitle = awayTeam.teamName + ' VS @' + homeTeam.teamName
          rows.push(
            <View key={i} style={{borderRadius:10, borderWidth: 1}}>
              <TouchableHighlight onPress={()=>this.handleScoreSheetChosenBtn(aMatch)}>
                <View>                
                  <View>
                    <Text>
                      {aMatch.matchDate.toDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                      {gameTitle}
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          )
        }
        else {
          if (awayTeam && homeTeam && aMatch.matchDate > today && (aMatch.homeTeamId == this.myTeamId || aMatch.awayTeamId == this.myTeamId)) {
            console.log(homeTeam)
            var gameTitle = awayTeam.teamName + ' VS @' + homeTeam.teamName
            rows.push(
              <View key={i} style={{borderRadius:10, borderWidth: 1}}>
                <TouchableHighlight onPress={()=>this.handleScoreSheetChosenBtn(aMatch)}>
                  <View>                
                    <View>
                      <Text style={{color:'gray'}}>                    
                        {aMatch.matchDate.toDateString()}
                      </Text>
                    </View>
                    <View>
                      <Text style={{color: 'gray', fontSize:26, paddingLeft:10, paddingRight:10}}>
                        {gameTitle}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            )
          }
        }
      })
    }
    return(
      <ScrollView>
        <View>
          <View style={{flex:1, flexDirection: 'row', justifyContent:'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>Today: {today.toDateString()}</Text>
          </View>
        </View>
        <View>
          <ActivityIndicator size="large" color="#0000ff" animating={this.state.pressed} />
        </View>
        <View style={{marginTop:20}}>              
          {rows}
        </View>
      </ScrollView>
    )
  }
}

export default ScoreSheets