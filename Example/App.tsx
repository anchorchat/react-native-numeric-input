import React, { useState } from 'react';
import { View } from 'react-native';
import NumericInput from './NumericInput';

const App = () => {
  const [value, setValue] = useState(43);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <NumericInput
        value={value}
        onChange={setValue}
        step={0.1}
        valueType="real"
        decimals={1}
        minValue={40}
      />
    </View>
  );
};

export default App;
