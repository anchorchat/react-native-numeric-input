/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View
} from 'react-native';
import NumericInput from './NumericInput'
import { create, PREDEF_RES } from 'react-native-pixel-perfect'
const calcSize = create(PREDEF_RES.iphone7.px)


export default class App extends Component {
  constructor(props) {
    console.log('fgfgf ')
    super(props)
    this.state = {
      value: 0,
      amount: 0,
      v1: 0,
      v2: 0,
      v3: 0,
      v4: 0,
      v5: 6,
      v6: 0,
      v7: 0,
      v8: 0,
      value1: 1
    }
    this.amount = 0
  }
  changeAmount(text) {
    this.amount = text
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.instructions}>
          Basic Numeric Input - no limits
        </Text>
        <NumericInput
          initValue={this.state.v2}
          value={this.state.v2}
          onChange={(v2) => this.setState({ v2 })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: null,
    width: null,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 60,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    marginTop: 5,
  },
  seprator: {
    height: 10,
    width: 200,
    margin: 10,
  }
});