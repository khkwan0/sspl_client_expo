import React, {Component} from 'react'
import {View, TouchableHighlight, Text, AsyncStorage} from 'react-native'
import Config from './Config'

class OtherMatches extends Component {
  static navigationOptions = {
    title: 'Browse Matches',
  };

  constructor(props) {
    super(props)
    this.byTeamHandler = this.byTeamHandler.bind(this)
    this.byDateHandler = this.byDateHandler.bind(this)
    this.getAllMatches = this.getAllMatches.bind(this)
    this.getAllMatchesRemote = this.getAllMatchesRemote.bind(this)
    this.getAllMatchesLocal = this.getAllMatchesLocal.bind(this)
    this.getDateFromDays = this.getDateFromDays.bind()

    this.matchData = null
    this.teams = this.props.navigation.state.params.teams

    this.state = {
      matchDataLoaded: false,
      errMsg: ''
    }
  }

  getDateFromDays(days) {
    today = new Date()
    today.setHours(7,0,0,0)
    today.setTime(today.getTime() + days * 864000)
    return today
  }

  getAllMatchesRemote() {
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/matches/' + Config.season)
      .then((result) => result.json())
      .then((resultJson) => {
        let matchData = {
          expireDate: this.getDateFromDays(1),
          matchData: resultJson
        }
        AsyncStorage.setItem(Config.matchDataStorageKey, JSON.stringify(matchData))
        resolve(resultJson)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  getAllMatchesLocal() {
    return new Promise((resolve, reject) => {
      if (Config.disableLocalSave) {
        reject('local save disabled')
      } else {
        AsyncStorage.getItem(Config.matchDataStorageKey)
        .then((matchDataStr) => {
          matchData = JSON.parse(matchDataStr)
          if (typeof matchData != 'undefined' && matchData && !matchData.expireDate != 'undefined' & matchData.expireDate) {
            if (matchData.expireDate > today) {
              reject('expired local cache or invalid local data')
            } else {
              resolve(matchData.matchData)
            }
          } else {
            reject('invalid local data')
          }
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
      }
    })
  }
  
  getAllMatches() {
    return new Promise((resolve, reject) => {
      this.getAllMatchesLocal()
      .then((matchData) => {
        resolve(matchData)
      })
      .catch((err) => {
        console.log(err)
        this.getAllMatchesRemote()
        .then((matchData) => {
          resolve(matchData)
        })
        .catch((err) => {
          reject(err)
        })
      })  
    })
  }

  componentDidMount() {
    this.getAllMatches()
    .then((matchData) => {
      this.matchData = matchData
      this.setState({
        matchDataLoaded: true
      })
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        errMsg: err
      })
    })
  }

  byTeamHandler() {
    if (this.matchData) {
      this.props.navigation.navigate('BrowseMatches', {teams: this.teams, matches: this.matchData, groupBy: 'team'})
    }
  }

  byDateHandler() {
    if (this.matchData) {
      this.props.navigation.navigate('BrowseMatches', {teams: this.teams, matches: this.matchData, groupBy: 'date'})
    }
  }

  render() {
    return (
      <View>
        {this.state.errMsg != '' &&
          <View>
            <Text>{this.state.errMsg}</Text>
          </View>
        }
        {this.state.matchDataLoaded &&
          <View>
            <TouchableHighlight onPress={this.byTeamHandler} style={{paddingTop:10}}>
              <View style={{borderRadius:10, borderWidth: 1}}>
                <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                  By Team
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.byDateHandler} style={{paddingTop:10}}>
              <View style={{borderRadius:10, borderWidth: 1}}>
                <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                  By Date
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        }
      </View>
    )
  }
}

export default OtherMatches