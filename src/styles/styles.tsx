import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    display: 'contents',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  formContainer: {
    width: '100%',
    height: '100%',
    padding: 10,
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
