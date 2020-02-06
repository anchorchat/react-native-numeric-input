import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { create, PREDEF_RES } from 'react-native-pixel-perfect';
import Button from '../Button';
import style from './styles';

let calcSize = create(PREDEF_RES.iphone7.px);

const propTypes = {
  iconSize: PropTypes.number,
  borderColor: PropTypes.string,
  iconStyle: PropTypes.any,
  totalWidth: PropTypes.number,
  totalHeight: PropTypes.number,
  separatorWidth: PropTypes.number,
  type: PropTypes.oneOf(['up-down', 'plus-minus']),
  valueType: PropTypes.oneOf(['real', 'integer']),
  rounded: PropTypes.any,
  textColor: PropTypes.string,
  containerStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  initValue: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  validateOnBlur: PropTypes.func,
  onLimitReached: PropTypes.func,
  value: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  upDownButtonsBackgroundColor: PropTypes.string,
  rightButtonBackgroundColor: PropTypes.string,
  leftButtonBackgroundColor: PropTypes.string,
  editable: PropTypes.bool,
  reachMaxIncIconStyle: PropTypes.any,
  reachMaxDecIconStyle: PropTypes.any,
  reachMinIncIconStyle: PropTypes.any,
  reachMinDecIconStyle: PropTypes.any,
  extraTextInputProps: PropTypes.any,
};

const defaultProps = {
  iconSize: calcSize(30),
  borderColor: '#d4d4d4',
  iconStyle: {},
  totalWidth: calcSize(220),
  separatorWidth: 1,
  type: 'plus-minus',
  rounded: false,
  textColor: 'black',
  containerStyle: {},
  inputStyle: {},
  initValue: null,
  valueType: 'integer',
  value: null,
  minValue: null,
  maxValue: null,
  step: 1,
  upDownButtonsBackgroundColor: 'white',
  rightButtonBackgroundColor: 'white',
  leftButtonBackgroundColor: 'white',
  editable: true,
  validateOnBlur: true,
  reachMaxIncIconStyle: {},
  reachMaxDecIconStyle: {},
  reachMinIncIconStyle: {},
  reachMinDecIconStyle: {},
  onLimitReached: (isMax, msg) => { },
  extraTextInputProps: {},
  onBlur: () => { },
  onFocus: () => { },
};

class NumericInput extends Component {
  constructor(props) {
    super(props);
    const noInitSent = props.initValue !== 0 && !props.initValue;

    this.state = {
      value: noInitSent ? props.value ? props.value : 0 : props.initValue,
      lastValid: noInitSent ? props.value ? props.value : 0 : props.initValue,
      stringValue: (noInitSent ? props.value ? props.value : 0 : props.initValue).toString(),
    };

    this.ref = null;
  }

  componentWillReceiveProps(props) {
    const { value } = this.state;

    const initSent = !(props.initValue !== 0 && !props.initValue);

    if (props.initValue !== value && initSent) {
      this.setState({
        value: props.initValue,
        lastValid: props.initValue,
        stringValue: props.initValue.toString(),
      });
    }
  }

  updateBaseResolution = (width, height) => {
    calcSize = create({ width, height });
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
      value = valueType === 'real' ? parseFloat(value) : parseInt(value);

      this.setState({ value, stringValue: value.toString() });
    } else if (maxValue !== null) {
      onLimitReached(true, 'Reached Maximum Value!');

      value = maxValue;

      this.setState({
        value,
        stringValue: value.toString(),
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
      value = valueType === 'real' ? parseFloat(value) : parseInt(value);
    } else if (minValue !== null) {
      onLimitReached(false, 'Reached Minimum Value!');
      value = minValue;
    }

    if (value !== propsValue) {
      onChange(Number(value));
    }

    this.setState({
      value,
      stringValue: value.toString(),
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
              this.setState({ value: currValue, legal });
              onChange(currValue);
            });
          }, 10);
        }, 15);
        setTimeout(() => this.ref.focus(), 20);
      }
    } else if (!legal && validateOnBlur) {
      this.setState({ stringValue: value });

      let parsedValue = valueType === 'real' ? parseFloat(value) : parseInt(value);

      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (parsedValue !== propsValue) {
        onChange(parsedValue);
      }

      this.setState({ value: parsedValue, legal, stringValue: parsedValue.toString() });
    } else {
      this.setState({ stringValue: value });
      let parsedValue = valueType === 'real' ? parseFloat(value) : parseInt(value);

      parsedValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (parsedValue !== propsValue) {
        onChange(parsedValue);
      }

      this.setState({ value: parsedValue, legal, stringValue: parsedValue.toString() });
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

    let match = stringValue.match(/-?[0-9]\d*(\.\d+)?/);

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
        this.ref.blur()
        setTimeout(() => {
          this.ref.clear()
          setTimeout(() => {
            onChange(lastValid);

            this.setState({ value: lastValid }, () => {
              this.setState({ value: lastValid, stringValue: lastValid.toString() });
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
      editable,
      separatorWidth,
      borderColor,
      iconStyle: propsIconStyle,
      totalWidth,
      totalHeight: propsTotalHeight,
      type,
      textColor,
      maxValue,
      minValue,
      rounded,
      inputStyle: propsInputStyle,
      containerStyle,
      upDownButtonsBackgroundColor,
      rightButtonBackgroundColor,
      leftButtonBackgroundColor,
      extraTextInputProps,
      reachMaxIncIconStyle,
      reachMinIncIconStyle,
      reachMaxDecIconStyle,
      reachMinDecIconStyle,
    } = this.props;
    const { value: stateValue, stringValue } = this.state;

    const iconStyle = [style.icon, propsIconStyle];
    const totalHeight = propsTotalHeight || (totalWidth * 0.4);
    const inputWidth = type === 'up-down' ? (totalWidth * 0.6) : (totalWidth * 0.4);
    const borderRadiusTotal = totalHeight * 0.18;
    const fontSize = totalHeight * 0.38;
    const maxReached = stateValue === maxValue;
    const minReached = stateValue === minValue;
    const inputContainerStyle = (
      type === 'up-down'
        ? [
          style.inputContainerUpDown,
          { width: totalWidth, height: totalHeight, borderColor },
          rounded ? { borderRadius: borderRadiusTotal } : {},
          containerStyle,
        ]
        : [
          style.inputContainerPlusMinus,
          { width: totalWidth, height: totalHeight, borderColor },
          rounded ? { borderRadius: borderRadiusTotal } : {},
          containerStyle,
        ]
    );
    const inputStyle = (
      type === 'up-down'
        ? [
          style.inputUpDown,
          {
            width: inputWidth,
            height: totalHeight,
            fontSize,
            color: textColor,
            borderRightWidth: 2,
            borderRightColor: borderColor,
          },
          propsInputStyle,
        ]
        : [
          style.inputPlusMinus,
          {
            width: inputWidth,
            height: totalHeight,
            fontSize,
            color: textColor,
            borderRightWidth: separatorWidth,
            borderLeftWidth: separatorWidth,
            borderLeftColor: borderColor,
            borderRightColor: borderColor,
          },
          propsInputStyle,
        ]
    );
    const upDownStyle = [
      {
        alignItems: 'center',
        width: totalWidth - inputWidth,
        backgroundColor: upDownButtonsBackgroundColor,
        borderRightWidth: 1,
        borderRightColor: borderColor,
      },
      rounded
        ? { borderTopRightRadius: borderRadiusTotal, borderBottomRightRadius: borderRadiusTotal }
        : {},
    ];

    const rightButtonStyle = [
      {
        position: 'absolute',
        zIndex: -1,
        right: 0,
        height: totalHeight - 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        backgroundColor: rightButtonBackgroundColor,
        width: (totalWidth - inputWidth) / 2,
      },
      rounded
        ? {
          borderTopRightRadius: borderRadiusTotal,
          borderBottomRightRadius: borderRadiusTotal,
        }
        : {},
    ];
    const leftButtonStyle = [
      {
        position: 'absolute',
        zIndex: -1,
        left: 0,
        height: totalHeight - 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: leftButtonBackgroundColor,
        width: (totalWidth - inputWidth) / 2,
        borderWidth: 0,
      },
      rounded
        ? { borderTopLeftRadius: borderRadiusTotal, borderBottomLeftRadius: borderRadiusTotal }
        : {},
    ];
    const inputWraperStyle = {
      alignSelf: 'center',
      borderLeftColor: borderColor,
      borderLeftWidth: separatorWidth,
      borderRightWidth: separatorWidth,
      borderRightColor: borderColor,
    };

    if (type === 'up-down') {
      return (
        <View style={inputContainerStyle}>
          <TextInput {...extraTextInputProps} editable={editable} returnKeyType="done" underlineColorAndroid="rgba(0,0,0,0)" keyboardType="numeric" value={stringValue} onChangeText={this.onChange} style={inputStyle} ref={ref => this.ref = ref} onBlur={this.onBlur} onFocus={this.onFocus} />
          <View style={upDownStyle}>
            <Button onPress={this.inc} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
              <Icon name="ios-arrow-up" size={fontSize} style={[...iconStyle, maxReached ? reachMaxIncIconStyle : {}, minReached ? reachMinIncIconStyle : {}]} />
            </Button>
            <Button onPress={this.dec} style={{ flex: 1, width: '100%', alignItems: 'center' }}>
              <Icon name="ios-arrow-down" size={fontSize} style={[...iconStyle, maxReached ? reachMaxDecIconStyle : {}, minReached ? reachMinDecIconStyle : {}]} />
            </Button>
          </View>
        </View>
      );
    }

    return (
      <View style={inputContainerStyle}>
        <Button onPress={this.dec} style={leftButtonStyle}>
          <Icon name="md-remove" size={fontSize} style={[...iconStyle, maxReached ? reachMaxDecIconStyle : {}, minReached ? reachMinDecIconStyle : {}]} />
        </Button>
        <View style={[inputWraperStyle]}>
          <TextInput {...extraTextInputProps} editable={editable} returnKeyType="done" underlineColorAndroid="rgba(0,0,0,0)" keyboardType="numeric" value={stringValue} onChangeText={this.onChange} style={inputStyle} ref={ref => this.ref = ref} onBlur={this.onBlur} onFocus={this.onFocus} />
        </View>
        <Button onPress={this.inc} style={rightButtonStyle}>
          <Icon name="md-add" size={fontSize} style={[...iconStyle, maxReached ? reachMaxIncIconStyle : {}, minReached ? reachMinIncIconStyle : {}]} />
        </Button>
      </View>
    );
  }
}

NumericInput.propTypes = propTypes;

NumericInput.defaultProps = defaultProps;

export default NumericInput;
