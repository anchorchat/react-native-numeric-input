import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import Button from '../Button';
import styles from './styles';

const propTypes = {
  decimals: PropTypes.number,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  buttonColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  valueType: PropTypes.oneOf(['real', 'integer']),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  validateOnBlur: PropTypes.func,
  onLimitReached: PropTypes.func,
  value: PropTypes.number.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  enableTextInput: PropTypes.bool,
  inputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
};

const defaultProps = {
  decimals: null,
  iconSize: 28,
  iconColor: '#FFFFFF',
  buttonColor: '#7862C2',
  borderColor: '#DBD6E9',
  textColor: '#7862C2',
  valueType: 'integer',
  minValue: null,
  maxValue: null,
  step: 1,
  enableTextInput: true,
  validateOnBlur: true,
  onLimitReached: (isMax, msg) => {},
  inputProps: {},
  onBlur: noop,
  onFocus: noop,
  style: {},
  buttonStyle: {},
  inputStyle: {},
  iconLeft: null,
  iconRight: null,
};

class NumericInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      lastValid: props.value,
      stringValue: this.stringify(props.value),
    };

    this.ref = null;
  }

  componentDidUpdate(prevProps) {
    const { value: propsValue } = this.props;
    const { value: stateValue } = this.state;

    if (prevProps.value !== propsValue || propsValue !== stateValue) {
      this.setState({
        value: propsValue,
        stringValue: this.stringify(propsValue),
      });
    }
  }

  stringify = (value) => {
    const {
      decimals = null,
    } = this.props;

    if (decimals === null || decimals === undefined) {
      return value.toString();
    }

    return value.toFixed(decimals);
  };

  inc = () => {
    const { value: stateValue } = this.state;
    const {
      value: propsValue,
      maxValue,
      step,
      valueType,
      onChange,
      onLimitReached,
    } = this.props;

    let value = propsValue && (typeof propsValue === 'number') ? propsValue : stateValue;

    if (maxValue === null || (value + step < maxValue)) {
      value = (value + step).toFixed(12);
      value = valueType === 'real' ? parseFloat(value) : parseInt(value, 10);

      this.setState({ value, stringValue: this.stringify(value) });
    } else if (maxValue !== null) {
      onLimitReached(true, 'Reached Maximum Value!');

      value = maxValue;

      this.setState({
        value,
        stringValue: this.stringify(value),
      });
    }

    if (value !== propsValue) {
      onChange(Number(value));
    }
  };

  dec = () => {
    const { value: stateValue } = this.state;
    const {
      value: propsValue,
      minValue,
      step,
      valueType,
      onChange,
      onLimitReached,
    } = this.props;

    let value = propsValue && (typeof propsValue === 'number') ? propsValue : stateValue;

    if (minValue === null || (value - step > minValue)) {
      value = (value - step).toFixed(12);
      value = valueType === 'real' ? parseFloat(value) : parseInt(value, 10);
    } else if (minValue !== null) {
      onLimitReached(false, 'Reached Minimum Value!');
      value = minValue;
    }

    if (value !== propsValue) {
      onChange(Number(value));
    }

    this.setState({
      value,
      stringValue: this.stringify(value),
    });
  };

  isLegalValue = (value, mReal, mInt) => {
    const { valueType, minValue, maxValue } = this.props;

    return (
      value === ''
      || (((valueType === 'real' && mReal(value))
        || (valueType !== 'real' && mInt(value)))
        && (maxValue === null
          || (parseFloat(value) <= maxValue))
        && (minValue === null
          || (parseFloat(value) >= minValue)))
    );
  };

  realMatch = (value) => (
    value && value.match(/-?\d+(\.(\d+)?)?/) && value.match(/-?\d+(\.(\d+)?)?/)[0]
    === value.match(/-?\d+(\.(\d+)?)?/).input
  );

  intMatch = (value) => (
    value && value.match(/-?\d+/) && value.match(/-?\d+/)[0]
    === value.match(/-?\d+/).input
  );

  onChange = (value) => {
    const { value: stateValue } = this.state;
    const {
      value: propsValue,
      validateOnBlur,
      onChange,
      valueType,
    } = this.props;

    const currValue = typeof propsValue === 'number' ? propsValue : stateValue;

    if ((value.length === 1 && value === '-') || (value.length === 2 && value === '0-')) {
      this.setState({ stringValue: '-' });
      return;
    }

    if ((value.length === 1 && value === '.') || (value.length === 2 && value === '0.')) {
      this.setState({ stringValue: '0.' });
      return;
    }

    if ((value.charAt(value.length - 1) === '.')) {
      this.setState({ stringValue: value });
      return;
    }

    const legal = this.isLegalValue(value, this.realMatch, this.intMatch);

    if (legal) {
      this.setState({ lastValid: value });
    }

    if (!legal && !validateOnBlur) {
      if (this.ref) {
        this.ref.blur();

        setTimeout(() => {
          this.ref.clear();

          setTimeout(() => {
            onChange(currValue - 1);

            this.setState({ value: currValue - 1 }, () => {
              this.setState({ value: currValue });
              onChange(currValue);
            });
          }, 10);
        }, 15);
        setTimeout(() => this.ref.focus(), 20);
      }
    } else if (!legal && validateOnBlur) {
      this.setState({ stringValue: value });

      let parsedValue = valueType === 'real' ? parseFloat(value) : parseInt(value, 10);

      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (parsedValue !== propsValue) {
        onChange(parsedValue);
      }

      this.setState({ value: parsedValue, stringValue: this.stringify(parsedValue) });
    } else {
      this.setState({ stringValue: value });
      let parsedValue = valueType === 'real' ? parseFloat(value) : parseInt(value, 10);

      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (parsedValue !== propsValue) {
        onChange(parsedValue);
      }

      this.setState({ value: parsedValue, stringValue: this.stringify(parsedValue) });
    }
  };

  onBlur = () => {
    const { stringValue, lastValid } = this.state;
    const {
      minValue,
      maxValue,
      onLimitReached,
      onChange,
      onBlur,
    } = this.props;

    const match = stringValue.match(/-?[0-9]\d*(\.\d+)?/);

    const legal = (
      match
      && match[0] === match.input
      && ((maxValue === null || (parseFloat(stringValue) <= maxValue))
        && (minValue === null || (parseFloat(stringValue) >= minValue)))
    );

    if (!legal) {
      if (minValue !== null && (parseFloat(stringValue) <= minValue)) {
        onLimitReached(true, 'Reached Minimum Value!');
      }

      if (maxValue !== null && (parseFloat(stringValue) >= maxValue)) {
        onLimitReached(false, 'Reached Maximum Value!');
      }

      if (this.ref) {
        this.ref.blur();
        setTimeout(() => {
          this.ref.clear();
          setTimeout(() => {
            onChange(lastValid);

            this.setState({ value: lastValid }, () => {
              this.setState({ value: lastValid, stringValue: this.stringify(lastValid) });
              onChange(lastValid);
            });
          }, 10);
        }, 15);
        setTimeout(() => this.ref.focus(), 50);
      }
    }

    onBlur();
  };

  onFocus = () => {
    const { value } = this.state;
    const { onFocus } = this.props;

    this.setState({ lastValid: value });

    onFocus();
  };

  render() {
    const {
      enableTextInput = true,
      iconSize = 28,
      iconColor = '#FFFFFF',
      maxValue = null,
      minValue = null,
      inputProps = {},
      style = {},
      buttonStyle = {},
      inputStyle = {},
      buttonColor = '#3BAEF7',
      borderColor = '#DBD6E9',
      textColor = '#7862C2',
      iconLeft = null,
      iconRight = null,
    } = this.props;
    const { value: stateValue, stringValue } = this.state;
    const maxReached = stateValue === maxValue;
    const minReached = stateValue === minValue;

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
      <View style={[styles.container, { borderColor }, style]}>
        <Button onPress={this.dec} disabled={minReached}>
          <View style={leftButtonStyle}>
            {iconLeft || <Icon name="md-remove" size={iconSize} color={iconColor} />}
          </View>
        </Button>
        <View>
          <TextInput
            editable={enableTextInput}
            returnKeyType="done"
            underlineColorAndroid="rgba(0, 0, 0, 0)"
            keyboardType="numeric"
            value={stringValue}
            onChangeText={this.onChange}
            ref={(ref) => { this.ref = ref; }}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            style={[styles.input, { color: textColor }, inputStyle]}
            {...inputProps} // eslint-disable-line react/jsx-props-no-spreading
          />
        </View>
        <Button onPress={this.inc} disabled={maxReached}>
          <View style={rightButtonStyle}>
            {iconRight || <Icon name="md-add" size={iconSize} color={iconColor} />}
          </View>
        </Button>
      </View>
    );
  }
}

NumericInput.propTypes = propTypes;

NumericInput.defaultProps = defaultProps;

export default NumericInput;
