import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    },
    formGroup: {
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 3,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    groupField: {
      width: '100%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: '#242c40',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
    },
    btnText: {
      color: 'white',
      fontWeight: 'bold',
    },
    error: {
      flexDirection: 'row',
      backgroundColor: '#dc3545',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    errorText: {
      color: 'white',
    }
});

export default styles;