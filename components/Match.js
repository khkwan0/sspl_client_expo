import React, {Component} from 'react'
import {ScrollView, View, StyleSheet, Text, AsyncStorage, TouchableHighlight} from 'react-native'
import Set from './Set'
import io from 'socket.io-client'
import Players from './Players'
import Player from './Player'
import Config from './Config'

class Match extends Component {
  static navigationOptions = {
    title: 'Match',
  };
  constructor(props) {
    super(props)

    matchData = this.props.navigation.state.params.matchData
    gameDataStorageKey = 'match'+matchData.matchId
    this.myTeamId = this.props.navigation.state.params.myTeamId
    this.players = new Players()
    this.knownNames = null // will hold the call back for name query

    this.state = {
      matchId: matchData.matchId,
      matchDate: matchData.matchDate,
      homeTeam: this.props.navigation.state.params.homeTeam,
      awayTeam: this.props.navigation.state.params.awayTeam,
      matchType: matchData.matchType,
      season: matchData.season,
      round: matchData.round,
      gameData: new Array(36),
      homeCaptainSubmit: matchData.homeCaptainSubmit,
      awayCaptainSubmit: matchData.awayCaptainSubmit,
      homeConfirmBackgroundColor: 'white',
      awayConfirmBackgroundColor: 'white',
      isComplete: matchData.isComplete,
      matchPointsHome: 0,
      matchPointsAway: 0

    }
    this.setGameData = this.setGameData.bind(this)
    this.wsSetup = this.wsSetup.bind(this)
    this.getGameData = this.getGameData.bind(this)
    this.getGameDataLocal = this.getGameDataLocal.bind(this)
    this.getGameDataRemote = this.getGameDataRemote.bind(this)
    this.getPlayerData = this.getPlayerData.bind(this)
    this.getPlayerDataByTeam = this.getPlayerDataByTeam.bind(this)
    this.getPlayerDataRemote = this.getPlayerDataRemote.bind(this)
    this.getPlayerDataLocal = this.getPlayerDataLocal.bind(this)
    this.homeTeamSubmit = this.homeTeamSubmit.bind(this)
    this.awayTeamSubmit = this.awayTeamSubmit.bind(this)
    this.nameSearch = this.nameSearch.bind(this)
    this.countMatchPoints = this.countMatchPoints.bind(this)
  }

  wsSetup() {
    //this.socket = openSocket('http://192.168.1.106:9988')
    this.socket = io(Config.server)
    this.socket.on('connect', (err) => {
      if (err) {
        console(err)
      }
      this.socket.emit('message', {event: 'join', data: {room: 'match'+matchData.matchId}})
    })
    this.socket.on('rcvmsg', (msg) => {
      if (typeof msg.event != 'undefined') {
        if (msg.event == 'gamedata') {
          this.newArray = this.state.gameData
          this.newArray[msg.data.gameNo] = msg.data
          let matchPointsHome = 0
          let matchPointsAway = 0
          if (this.state.matchType != 'nine') {
            for (let i = 1; i < 6; i++) {  // magic number 6 is the number of sets in a non nineball match + 1
              let setTally = this.countMatchPoints(i, this.newArray)
              matchPointsHome += setTally.home
              matchPointsAway += setTally.away
            }  
          }
          this.setState({
            gameData: this.newArray,
            homeCaptainSubmit: false,
            awayCaptainSubmit: false,
            matchPointsHome: matchPointsHome,
            matchPointsAway: matchPointsAway
          })
          AsyncStorage.setItem(gameDataStorageKey, JSON.stringify(this.state))
        }
        if (msg.event == 'submitmatchdata') {      
          if (msg.home) {
            this.setState({
              homeCaptainSubmit: msg.confirm
            })        
          } else {
            this.setState({
              awayCaptainSubmit: msg.confirm
            })
          }
          AsyncStorage.setItem(gameDataStorageKey, JSON.stringify(this.state))
        }
        if (msg.event == 'namequery') {
          console.log(msg.names)
          console.log(this.knownNames)
          this.knownNames(msg.names)
        }
      }
    })
  }

  countMatchPoints(setNumber, _gameData) {

    let tempHomeSetScore = 0
    let tempAwaySetScore = 0
    let matchPointsAway = 0
    let matchPointsHome = 0
    let numberOfGames = 5
    let startingGameNumber = 0

    if (setNumber % 2) {
      numberOfGames = 4
    }

    if (setNumber == 1) {
      startingGameNumber = 1
    } else if (setNumber == 2) {
      startingGameNumber = 5
    } else if (setNumber == 3) {
      startingGameNumber = 10
    } else if (setNumber == 4) {
      startingGameNumber = 14
    } else if (setNumber == 5) {
      startingGameNumber = 19
      if (this.state.matchType == 'eight') {
        numberOfGames = 1
      }
    }
    console.log(numberOfGames)
    if (startingGameNumber == 19) {
      for (let i = startingGameNumber; i < startingGameNumber + numberOfGames; i++) {
        if (typeof _gameData[i] != 'undefined' && _gameData[i] && _gameData[i].winner == 'home') {
          matchPointsHome++
        }
        if (typeof _gameData[i] != 'undefined' && _gameData[i] && _.gameData[i].winner == 'away') {
          matchPointsAway++
        }
      }
    } else {
      for (let i = startingGameNumber; i < (startingGameNumber + numberOfGames); i++) {
        if (typeof _gameData[i] != 'undefined' && _gameData[i]) {
          console.log(_gameData[i].winner)
          if (_gameData[i].winner == 'home') {
            tempHomeSetScore++
          }
          if (_gameData[i].winner == 'away') {
            tempAwaySetScore++
          }
        }
      }
      if ((tempHomeSetScore + tempAwaySetScore) == 4 && numberOfGames == 4) {
        if (tempHomeSetScore == tempAwaySetScore) {
          matchPointsAway++
          matchPointsHome++
        } else if (tempHomeSetScore > tempAwaySetScore) {
          matchPointsHome += 2
        } else {
          matchPointsAway += 2
        }
      } else if ((tempHomeSetScore + tempAwaySetScore) == 5 && numberOfGames == 5) {
        if (tempHomeSetScore > tempAwaySetScore) {
          matchPointsHome += 3
        } else {
          matchPointsAway += 3
        }
      }
    }
    console.log('matchpointshome: '+ matchPointsHome)
    return {home: matchPointsHome, away: matchPointsAway}
  }

  nameSearch(name, knownNamesCallBack) {
    this.knownNames = knownNamesCallBack
    this.socket.emit('message', {event: 'namequery', data: {name: name}})
  }

  getGameDataLocal() {
    return new Promise((resolve, reject) => {
      if (!Config.disableLocalSave) {
        AsyncStorage.getItem(gameDataStorageKey)
        .then((gameDataStr) => {
          gameData = JSON.parse(gameDataStr)
          resolve(gamehData)
        })
        .catch((err) => {
          reject(err)
        })
      } else {
        reject('local storage disabled')
      }
    })
  }

  getGameDataRemote() {
    console.log('get game data remote')
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/match/' + matchData.matchId)
      .then((result) => result.json())
      .then((_gameData) => {
        resolve(_gameData)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  getGameData() {
    console.log('get game data')
    return new Promise((resolve, reject) => {
      this.getGameDataLocal()
      .then((_gameData) => {
        newArray = this.state.gameData
        _gameData.forEach((gameData) => {
          newArray[gameData.gameNo] = gameData
        })
        resolve(newArray)
      })
      .catch((err) => {
        console.log(err)
        this.getGameDataRemote()
        .then((_gameData) => {
          newArray = this.state.gameData
          _gameData.forEach((gameData) => {
            newArray[gameData.gameNo] = gameData
          })
          resolve(newArray)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
  }

  getPlayerDataLocal() {
    return new Promise((resolve, reject) => {
      if (!Config.disableLocalSave) {
        reject('not implemented')
      } else {
        reject('local storage disabled')
      }
    })
  }

  getPlayerDataByTeam(teamId) {  
    console.log('getPlayerDataByTeam('+teamId+')')
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/players/' + teamId)
      .then((results) => results.json())
      .then((resultJson) => {

        if (typeof resultJson.players != 'undefined' && resultJson.players) {
          resolve(resultJson.players)  
        }
      })
      .catch((err) => {        
        console.log(err)
        reject(err)
      })    
    })
  }

  getPlayerDataRemote() {
    console.log('getplayerdataremote')
    return new Promise((resolve, reject) => {
      toPromise = []
      toPromise.push(this.getPlayerDataByTeam(this.state.homeTeam.teamId))
      toPromise.push(this.getPlayerDataByTeam(this.state.awayTeam.teamId))
      Promise.all(toPromise)
      .then((_players) => {
        if (_players.length) {
          _players.forEach((team) => {
            if (team.length) {
              team.forEach((player) => {
                this.players.addPlayer(player[0]._id, player[0].playerName)
              })
            }
          })
        }
        resolve(this.players)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  getPlayerData() {
    return new Promise((resolve, reject) => {
      this.getPlayerDataLocal()
      .then((_playerData) => {
        resolve(_playerData)
      })
      .catch((err) => {
        this.getPlayerDataRemote()
        .then((_playerData) => {
          //console.log(_playerData)
          resolve(_playerData)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
  }

  componentWillUnmount() {
    if (typeof this.props.navigation.state.params.scoreSheetReset != 'undefined') {
      this.props.navigation.state.params.scoreSheetReset()
    }
  }

  componentDidMount() {
    this.wsSetup()
    this.getGameData()
    .then((_gameData) => {
      let matchPointsHome = 0
      let matchPointsAway = 0
      if (this.state.matchType != 'nine') {
        for (let i = 1; i < 6; i++) {  // magic number 6 is the number of sets in a non nineball match + 1
          let setTally = this.countMatchPoints(i, _gameData)
          matchPointsHome += setTally.home
          matchPointsAway += setTally.away
        }  
      }
      this.getPlayerData()
      .then((_players) => {
        this.setState({
          players: _players,
          gameData: _gameData,
          matchPointsHome: matchPointsHome,
          matchPointsAway: matchPointsAway
        })
      })
      .catch((err) => {        
        console.log(err)
        this.setState({
          gameData:_gameData,
          matchPointsHome: matchPointsHome,
          matchPointsAway: matchPointsAway
        })
      })
    })
    .catch((err) => {
      this.getPlayerData()
      .then((_players) => {
        this.setState({
          players:_players
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
  }

  setGameData(gameData) {
    gameDataMsg = gameData
    gameDataMsg.matchId = matchData.matchId
    this.socket.emit('message', {event: 'gamedata', data: {room: 'match'+matchData.matchId, gameData: gameDataMsg}})
    newArray = this.state.gameData
    newArray[gameData.gameNo] = gameData
    let matchPointsHome = 0
    let matchPointsAway = 0
    if (this.state.matchType != 'nine') {
      for (let i = 1; i < 6; i++) {  // magic number 6 is the number of sets in a non nineball match + 1
        let setTally = this.countMatchPoints(i, newArray)
        matchPointsHome += setTally.home
        matchPointsAway += setTally.away
      }  
    }
    this.setState({
      gameData: newArray,
      awayCaptainSubmit: false,
      homeCaptainSubmit: false,
      matchPointsHome: matchPointsHome,
      matchPointsAway: matchPointsAway
    })
    if (!this.socket.connected) {
      console.log('not connected')
      AsyncStorage.setItem(gameDataStorageKey, JSON.stringify(this.state))
    }
  }

  homeTeamSubmit() {
    confirmState = this.state.homeCaptainSubmit ? false : true
    this.socket.emit('message', {event: 'submitmatchdata',data: {room: 'match'+matchData.matchId, home: true, matchid: matchData.matchId, confirm: confirmState}})
    this.setState({
      homeCaptainSubmit: confirmState
    })
  }

  awayTeamSubmit() {
    confirmState = this.state.awayCaptainSubmit ? false: true
    this.socket.emit('message', {event: 'submitmatchdata',data: {room: 'match'+matchData.matchId, home: false, confirm: confirmState}})
    this.setState({
      awayCaptainSubmit: confirmState
    })
  }

  render() {
    let homeTeam = this.props.navigation.state.params.homeTeam
    let awayTeam = this.props.navigation.state.params.awayTeam
    console.log(this.state.matchType)
    if (this.state.matchType == 'nine') {
      toRender = (
        <View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontSize: 16}}>{this.state.matchDate.toDateString()}</Text>
            </View>
            <View>
              <Text style={{fontSize:20}}>Nine Ball</Text>
            </View>
            <View>
              <Text style={{fontSize:16}}>Round {this.state.round}</Text>
            </View>
          </View>
          <View style={styles.matchMetaData}>
            <View>
              <Text style={{fontSize: 18}}>Home: {this.state.homeTeam.teamName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 18}}>Away: {this.state.awayTeam.teamName}</Text>
            </View>
          </View>
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={1} 
            type={2}
            numGames={4}
            startingGameNo={1}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={2}
            type={1}
            numGames={8} 
            startingGameNo={5}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={3} 
            type={2}
            numGames={4}
            startingGameNo={13}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={4}
            type={1}
            numGames={8} 
            startingGameNo={17}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={5} 
            type={2}
            numGames={4}
            startingGameNo={25}
            isComplete = {this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={6}
            type={1}
            numGames={8} 
            startingGameNo={33}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            />                        
        </View>
      )
    }
    if (this.state.matchType == 'eight') {
      toRender = (
        <View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontSize: 16}}>{this.state.matchDate.toDateString()}</Text>
            </View>
            <View>
              <Text style={{fontSize:20}}>Eight Ball</Text>
            </View>
            <View>
              <Text style={{fontSize:16}}>Round {this.state.round}</Text>
            </View>
          </View>
          <View style={styles.matchMetaData}>
            <View>
              <Text style={{fontSize: 18}}>Home: {this.state.homeTeam.teamName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 18}}>Away: {this.state.awayTeam.teamName}</Text>
            </View>
          </View>
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={1} 
            type={2}
            numGames={4}
            startingGameNo={1}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={2}
            type={1}
            numGames={5} 
            startingGameNo={5}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={3} 
            type={2}
            numGames={4}
            startingGameNo={10}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={4}
            type={1}
            numGames={5} 
            startingGameNo={14}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={5} 
            type={2}
            numGames={1}
            startingGameNo={19}
            isComplete = {this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
        </View>
      )
    }
    if (this.state.matchType == 'mixed') {
      toRender = (
        <View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontSize: 16}}>{this.state.matchDate.toDateString()}</Text>
            </View>
            <View>
              <Text style={{fontSize:20}}>Mixed</Text>
            </View>
            <View>
              <Text style={{fontSize:16}}>Round {this.state.round}</Text>
            </View>
          </View>
          <View style={styles.matchMetaData}>
            <View>
              <Text style={{fontSize: 18}}>Home: {this.state.homeTeam.teamName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 18}}>Away: {this.state.awayTeam.teamName}</Text>
            </View>
          </View>
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={1} 
            type={2}
            numGames={4}
            startingGameNo={1}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='m_eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={2}
            type={1}
            numGames={5} 
            startingGameNo={5}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='m_eight'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={3} 
            type={2}
            numGames={4}
            startingGameNo={10}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='m_nine'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={4}
            type={1}
            numGames={5} 
            startingGameNo={14}
            isComplete={this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='m_nine'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={5} 
            type={2}
            numGames={5}
            startingGameNo={19}
            isComplete = {this.state.isComplete}
            nameSearch={this.nameSearch}
            myTeamId={this.myTeamId}
            gameType='m_wild'
            matchPointsAway={this.state.matchPointsAway}
            matchPointsHome={this.state.matchPointsHome}
            />
        </View>
      )      
    }
    if (this.myTeamId == homeTeam.teamId) {      
      homeConfirmBackgroundColor = this.state.homeCaptainSubmit? 'green' : 'yellow'
      awayConfirmBackgroundColor = this.state.awayCaptainSubmit? 'green' : 'yellow'
      awayTeamString = this.state.awayCaptainSubmit? 'AWAY team HAS signed this scoresheet': 'Waiting for AWAY team to sign this score sheet'
      homeTeamString = this.state.homeCaptainSubmit? 'HOME team HAS signed this scoresheet': 'HOME TEAM - Press here to sign this scoresheet'
      
      var toConfirm = (
        <View style={{marginTop: 20}}>
          <View style={{backgroundColor: homeConfirmBackgroundColor, borderRadius: 10, borderWidth: 1}}>
            <TouchableHighlight onPress={this.homeTeamSubmit}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 24}}>{homeTeamString}</Text>          
              </View>
            </TouchableHighlight>
          </View>
          <View style={{marginTop:20}}>
            <View style={{flex: 1, alignItems:'center', backgroundColor: awayConfirmBackgroundColor, borderRadius: 10, borderWidth: 1,  paddingLeft:10, marginBottom:30}}>
              <Text style={{fontSize: 24}}>{awayTeamString}</Text>
            </View>
          </View>
        </View>
      )
    }
    if (this.myTeamId == awayTeam.teamId) {
      homeConfirmBackgroundColor = this.state.homeCaptainSubmit? 'green' : 'yellow'
      awayConfirmBackgroundColor = this.state.awayCaptainSubmit? 'green' : 'yellow'
      awayTeamString = this.state.awayCaptainSubmit? 'AWAY team HAS signed this scoresheet': 'AWAY TEAM - Press here to sign this scoresheet'
      homeTeamString = this.state.homeCaptainSubmit? 'HOME team HAS signed this scoresheet': 'Waiting for HOME team to sign this scoresheet'
      var toConfirm = (
        <View>
          <View style={{backgroundColor: awayConfirmBackgroundColor, borderRadius:10, borderWidth: 1, paddingLeft: 10}}>
            <TouchableHighlight onPress={this.awayTeamSubmit}>
              <View>
                <Text style={{fontSize:24}}>{awayTeamString}</Text>          
              </View>
            </TouchableHighlight>
          </View>
          <View style={{backgroundColor: homeConfirmBackgroundColor, borderRadius:10, borderWidth: 1, paddingLeft: 10, marginTop: 20}}>
            <View>
              <Text style={{fontSize: 24}}>{homeTeamString}</Text>
            </View>
          </View>
        </View>
      )
    }
    return(
      <ScrollView>
        {toRender}
        <View>
          {toConfirm}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  matchMetaData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default Match