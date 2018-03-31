import React, {Component} from 'react';
import {Button} from 'react-native';

class ChoosePlayerButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHome: this.props.isHome,
      gameNo: this.props.gameNo,
      isDoubles: this.props.isDoubles,
      onTop: this.props.onTop,
      name: this.props.playerName
    }
    this.choosePlayer = this.choosePlayer.bind(this)
  }

  choosePlayer() {
      this.props.showPlayerPicker(this.state)
  }
  
  render() {
    return(
      <Button onPress={this.choosePlayer} title={this.props.playerName} />
    )
  }
}

export default ChoosePlayerButton;