import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  formContainer: {
    width: '90%',
    marginHorizontal: '5%',
  },
  groupField: {
    width: '100%',
  },
  lightContainer: {
    backgroundColor: 'white',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
  lightThemeInput: {
    color: '#242c40',
  },
  darkThemeInput: {
    color: '#d0d0c0',
  },
});

export default globalStyles;
