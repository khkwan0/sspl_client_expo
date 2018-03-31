import React, {Component} from 'react'
import {TextInput, View, Text, Modal, StyleSheet, TouchableHighlight, Picker, Button} from 'react-native'

class AddPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerName: '',
      showModal: true,
      knownPlayers: [],
      selectedValue: -1
    }

    this.handleChangeText = this.handleChangeText.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setName = this.setName.bind(this)
    this.guid = this.guid.bind(this)
    this.knownPlayers = this.knownPlayers.bind(this)
    this.updateSelected = this.updateSelected.bind(this)
    this.addKnownPlayer = this.addKnownPlayer.bind(this)
  }

  handleChangeText(newName) {
    this.setState({
      playerName: newName
    })
    if (newName.length > 1) {
      this.props.nameSearch(newName, this.knownPlayers)
    }    
  }
  
  knownPlayers(players) {
    this.setState({
      knownPlayers: players
    })
  }

  closeModal() {
    this.props.closeAddPlayer()
  }

  setName() {    
    // save new player to db
    if (this.state.playerName.length > 1) {
      this.props.players.addNewPlayer(this.state.playerName)
      .then((player) => {
        this.props.addNewPlayer(player)
        this.closeModal()
      })
      .catch((err) => {  // if no network, create temp id
        console.log(err)
        let tempId = this.guid()
        let player = this.props.players.AddPlayer(tempId, this.state.playerName)
        this.props.addNewPlayer(player)
        this.closeModal()
      })
    }
  }

  guid() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  updateSelected(val) {
    this.setState({
      selectedValue: val
    })
  }

  addKnownPlayer() {
    if (this.state.selectedValue != -1) {
      let player = {playerId: this.state.knownPlayers[this.state.selectedValue]._id, playerName: this.state.knownPlayers[this.state.selectedValue].playerName}
      this.props.addNewPlayer(player)
      this.closeModal()
    }
  }

  render() {
    let knownNames = []
    for(var index in this.state.knownPlayers) {      
      knownNames.push(
        <Picker.Item key={index} value={index} label={this.state.knownPlayers[index].playerName} />
      )
    }
    return(
      <Modal animationType='slide' visible={this.state.showModal} onRequestClose={this.closeModal}>
        <View style={styles.modalView}>
          <View>
            <TouchableHighlight onPress={this.closeModal} title='Cancel'>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 26, color:'black'}}>Cancel</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{paddingTop:10}}>
            <TextInput autoCorrect={false} autoFocus={true} maxLength={32} style={{height: 40, width: 250, fontSize: 24, color:'black', backgroundColor:'white'}} placeholder="Player Name" value={this.state.playerName} onChangeText={this.handleChangeText} />
          </View>
          {knownNames.length > 0 &&
            <View style={{flexDirection:'column', justifyContent:'flex-start'}}>
              <View style={{flex:.5}}>
                <Picker selectedValue={this.state.selectedValue} onValueChange={this.updateSelected} itemStyle={{width:300}}>
                  <Picker.Item value={-1} label='Known Players:' />
                  {knownNames}
                </Picker>
              </View>
              <View style={{flex:.2}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                  <TouchableHighlight onPress={this.closeModal} style={{paddingLeft: 10, paddingRight: 10, borderRadius: 10, borderWidth: 1}}>
                    <Text style={{fontSize: 28}}>Cancel</Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.addKnownPlayer} style={{ paddingLeft: 10, paddingRight: 10, borderRadius: 10, borderWidth: 1}}>
                    <Text style={{fontSize: 28}}>OK</Text>
                  </TouchableHighlight>
                </View>
              </View>              
            </View>
          }
          {knownNames.length == 0 && this.state.playerName.length > 1 &&
            <View style={{flexDirection:'column'}}>
              <View style={{flex:.4, flexDirection:'row', justifyContent:'center', alignItems:'baseline'}}>
                <Text style={{fontSize: 28}}>{this.state.playerName}</Text><Text> is valid</Text>
              </View>
              <View>
               <Button onPress={this.setName} title='Submit' color='black' />
              </View>
            </View>
          }
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor:'gray',
    marginTop:22,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  playerName: {
    fontSize:18
  },

})

export default AddPlayer