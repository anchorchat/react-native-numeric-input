import React, { Component } from 'react';
import { View } from 'react-native';
import NumericInput from './NumericInput';

export default class App extends Component {
  state = {
    value: 42,
  };

  render() {
    const { value } = this.state;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <NumericInput
          value={value}
          onChange={(v2) => this.setState({ v2 })}
          step={0.1}
          valueType="real"
          decimals={1}
        />
      </View>
    );
  }
}
