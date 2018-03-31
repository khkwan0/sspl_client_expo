import React, { Component } from 'react'
import { Modal, View, Picker, Text, StyleSheet, Button } from 'react-native'

class PlayerPicker extends Component {
  constructor(props) {
    super(props)
    this.updatePlayer = this.updatePlayer.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.selectPlayer = this.selectPlayer.bind(this)
    
    this.state = {
      showModal: true,
      selectedValue: -1
    }
  }

  updatePlayer(playerId) {
    this.setState({
      selectedValue: playerId
    })
  }

  selectPlayer() {
    playerId = this.state.selectedValue
    if (playerId != -2) {
      this.props.setPlayer(playerId)
      this.closeModal()
    } else {
      this.props.showAddPlayer()
    }
  }

  closeModal() {
    this.props.closePlayerPicker()
  }

  render() {    
    var players = this.props.team.teamPlayers
    console.log(players)
    var pickerItems = []
    players.map((playerId, i) => {
      let player = this.props.players.getPlayer(playerId)
      console.log(player)
      var playerName = ''
      if (player) {
        playerName = player.playerName
        pickerItems.push(
          <Picker.Item key={i} value={player.playerId} label={playerName} />
        )
      }
    })
    return(
      <Modal animationType='slide' visible={this.state.showModal} onRequestClose={this.closeModal}>
        {this.state.playerId != -2 &&
          <View style={styles.modalView}>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button onPress={this.closeModal} title="Cancel" />
              <Button onPress={this.selectPlayer} title="Done" />
            </View>
            <Picker selectedValue={this.state.selectedValue} onValueChange={this.updatePlayer}>
              <Picker.Item value={-1} label="Choose A Player" />
              {pickerItems}
              <Picker.Item value={-2} label="Add new Player" />
            </Picker>
          </View>
        }
      </Modal>
    )


  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor:'gray',
    height:300,
    marginTop:22
  }
})

export default PlayerPicker