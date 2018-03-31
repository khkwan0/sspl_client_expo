import React, {Component} from 'react'
import {Modal, View, Button, Text} from 'react-native'

class HomeAwayPicker extends Component {

  static navigationOptions = {
    title: 'Home or Away',
  };

  constructor(props) {
    super(props)
    this.handleHomePress = this.handleHomePress.bind(this);
    this.handleAwayPress = this.handleAwayPress.bind(this);
  }

  handleHomePress() {
    this.props.navigation.state.params.setHomeAway(true)
    this.props.navigation.navigate('ConfirmDate', {setDate: this.props.navigation.state.params.setDate, backToNewGameKey: this.props.navigation.state.key})
  }

  handleAwayPress() {
    this.props.navigation.state.params.setHomeAway(false)
    this.props.navigation.navigate('ConfirmDate', {setDate: this.props.navigation.state.params.setDate, backToNewGameKey: this.props.navigation.state.key})
  }

  render() {
    return(
      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <View>
          <Text>Are you the home or away team?</Text>
        </View>
        <Button title="Home" onPress={this.handleHomePress} />
        <Button title="Away" onPress={this.handleAwayPress} />      
      </View>
    )
  }
}

export default HomeAwayPicker