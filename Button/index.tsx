/* eslint react/require-default-props: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform as RNPlatform,
  TouchableOpacity as RNTouchableOpacity,
  TouchableNativeFeedback as RNTouchableNativeFeedback,
  View as RNView,
} from 'react-native';
import noop from 'lodash/noop';

const propTypes = {
  disabled: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  children: PropTypes.node.isRequired,
};

const handlePress = (callback) => {
  requestAnimationFrame(callback);
};

const Button = (props) => {
  const {
    disabled = false,
    style = {},
    onPress = noop,
    children,
  } = props;

  return (
    RNPlatform.OS === 'ios'
      ? (
        <RNTouchableOpacity disabled={disabled} style={style} onPress={() => handlePress(onPress)}>
          {children}
        </RNTouchableOpacity>
      )
      : (
        <RNTouchableNativeFeedback disabled={disabled} onPress={() => handlePress(onPress)}>
          <RNView style={style}>{children}</RNView>
        </RNTouchableNativeFeedback>
      )
  );
};

Button.propTypes = propTypes;

export default Button;
