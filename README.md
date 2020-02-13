# @anchorchat/react-native-numeric-input
A cross platform stylish numeric input for react native.

## Installation
### Latest version
v1.8.2
#### if you have react-native-vector-icons installed in your project
```bash
yarn add @anchorchat/react-native-numeric-input
```
or with npm
```bash
npm install @anchorchat/react-native-numeric-input --save
```
#### if you don't have react-native-vector-icons installed in your project
```bash
yarn add @anchorchat/react-native-numeric-input react-native-vector-icons
react-native link
```

or with npm

```bash
npm install @anchorchat/react-native-numeric-input react-native-vector-icons --save
react-native link
```
if you're experiencing issues with `react-native link` which is used to install react-native-vector-icons
please refer to [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) to see manual installation steps

[link to npm page](https://www.npmjs.com/package/@anchorchat/react-native-numeric-input)

## Usage

### import Component
```javascript
import NumericInput from 'react-native-numeric-input'
```
### Basic Usage
```javascript
<NumericInput onChange={value => console.log(value)} />
```

### Keep State Value
```javascript
<NumericInput value={this.state.value} onChange={value => this.setState({value})} />
```
### Advanced Usage
```javascript
  <NumericInput 
    value={this.state.value} 
    onChange={value => this.setState({value})} 
    onLimitReached={(isMax,msg) => console.log(isMax,msg)}
    iconSize={25}
    step={1.5}
    valueType="real"
    textColor="#B0228C" 
    buttonColor="#EA3788" 
  />
```


## Props
Name                                | Type                                | Default
------------------------------------|-------------------------------------|:-------:
**value**                           |`number`                             | Required
**minValue**                        |`number`                             | null
**maxValue**                        |`number`                             | null
**step**                            |`number`                             | 1
**valueType**                       |`'integer'` or `'real'`              | `'integer'`
**iconColor**                       |`string`                             | `'#FFFFFF'`
**buttonColor**                     |`string`                             | `'#3BAEF7'`
**borderColor**                     |`string`                             | `'#DBD6E9'`
**textColor**                       |`string`                             | `'#7862C2'`
**inputStyle**                      |`object`                             | {}
**onChange**                        |`function`                           | Required
**onLimitReached**                  |`function`                           | () => {}
**enableTextInput**                 |`boolean`                            | true
**validateOnBlur**                  |`boolean`                            | true
**style**                           |`object`                             | {}
**buttonStyle**                     |`object`                             | {}
**inputStyle**                      |`object`                             | {}
**iconLeft**                        |`node`                               | null
**iconRight**                       |`node`                               | null
**inputProps**                      |`object`                             | {}

## License
This project is licensed under the MIT License
