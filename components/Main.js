import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class Main extends Component {
  render() {
    return (
      <View>
        <Button onPress={} title="New Game" />
        <Button onPress={} title="Archives" />
      </View>
    );
  }
}

export default StackNavigator({
  Home: {
    screen: Main,
  },  
});