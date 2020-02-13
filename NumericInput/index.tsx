/* eslint react/require-default-props: 0 */
import React from 'react';
import { View as RNView, Text as RNText, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import round from 'lodash/round';
import { sprintf } from 'sprintf-js';

import styles from './styles';

const propTypes = {
  decimals: PropTypes.number,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  buttonColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
};

const NumericInput = (props) => {
  const {
    iconSize = 28,
    iconColor = '#FFFFFF',
    maxValue = null,
    minValue = null,
    style = {},
    buttonStyle = {},
    textStyle = {},
    buttonColor = '#3BAEF7',
    borderColor = '#DBD6E9',
    textColor = '#7862C2',
    iconLeft = null,
    iconRight = null,
    value,
    onChange,
    step = 1,
    decimals = 0,
  } = props;
  const maxReached = value === maxValue;
  const minReached = value === minValue;

  const increment = () => {
    if (maxValue && value + step > maxValue) {
      return false;
    }

    const roundedValue = round(value + step, decimals);
    return onChange(roundedValue);
  };

  const decrement = () => {
    if (minValue && value - step < minValue) {
      return false;
    }

    const roundedValue = round(value - step, decimals);
    return onChange(roundedValue);
  };

  const leftButtonStyle = [
    styles.button,
    minReached ? styles.disabled : null,
    { backgroundColor: buttonColor },
    buttonStyle,
  ];

  const rightButtonStyle = [
    styles.button,
    maxReached ? styles.disabled : null,
    { backgroundColor: buttonColor },
    buttonStyle,
  ];

  return (
    <RNView style={[styles.container, { borderColor }, style]}>
      <RNTouchableOpacity onPress={decrement} disabled={minReached}>
        <RNView style={leftButtonStyle}>
          {iconLeft || <Icon name="md-remove" size={iconSize} color={iconColor} />}
        </RNView>
      </RNTouchableOpacity>
      <RNText style={[styles.text, { color: textColor }, textStyle]}>
        {sprintf(`%.${decimals}f`, value)}
      </RNText>
      <RNTouchableOpacity onPress={increment} disabled={maxReached}>
        <RNView style={rightButtonStyle}>
          {iconRight || <Icon name="md-add" size={iconSize} color={iconColor} />}
        </RNView>
      </RNTouchableOpacity>
    </RNView>
  );
};

NumericInput.propTypes = propTypes;

export default NumericInput;
