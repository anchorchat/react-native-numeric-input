import { StyleSheet as RNStyleSheet } from 'react-native';

export default RNStyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderWidth: 2,
    borderRadius: 28,
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 28,
    marginHorizontal: 12,
    textAlign: 'center',
    minWidth: 80,
    fontVariant: ['tabular-nums'], // Convert to monospace font
  },
});
