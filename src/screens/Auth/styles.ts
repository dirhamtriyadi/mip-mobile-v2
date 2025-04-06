import { StyleSheet } from 'react-native';

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderRadius: 5,
      borderStyle: 'solid',
      borderWidth: 1,
      marginBottom: 20,
      paddingLeft: 10,
      color: theme === 'dark' ? '#fff' : '#000',
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
    },
    button: {
      backgroundColor: theme === 'dark' ? '#007BFF' : '#242c40',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default createStyles;
