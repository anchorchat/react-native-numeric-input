import { StyleSheet as RNStyleSheet } from 'react-native';
import { create, PREDEF_RES } from 'react-native-pixel-perfect';

const calcSize = create(PREDEF_RES.iphone7.px);

export default RNStyleSheet.create({
  seprator: {
    backgroundColor: 'grey',
    height: calcSize(80),
  },
  inputContainerUpDown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderColor: 'grey',
    borderWidth: 1,
  },
  inputContainerPlusMinus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  inputUpDown: {
    textAlign: 'center',
    padding: 0,

  },
  inputPlusMinus: {
    textAlign: 'center',
    padding: 0,
  },
  icon: {
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  upDown: {
    alignItems: 'center',
    paddingRight: calcSize(15),
  },
});
