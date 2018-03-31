import React, {Component} from 'react'
import {View, Button, Text} from 'react-native'

class ConfirmDate extends Component {
  constructor(props) {
    super(props)
    this.confirmDate = this.confirmDate.bind(this)
    this.changeDate = this.changeDate.bind(this)
    this.aDate = new Date()
  }

  confirmDate() {
    this.props.navigation.state.params.setDate(this.aDate)
    this.props.navigation.goBack(this.props.navigation.state.params.backToNewGameKey)
  }

  changeDate() {

  }

  render() {
    const aDate = this.aDate.toDateString()
    return(
      <View>
        <Text>Is this the correct Date?</Text>
        <Text>{aDate}</Text>
        <Button onPress={this.confirmDate} title="Yes" />
        <Button onPress={this.changeDate} title="No" />
      </View>
    )
  }
}

export default ConfirmDate
