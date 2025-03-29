import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
      },
      absenContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      colContainer: {
        flexDirection: 'column',
        // flexWrap: 'wrap',
        justifyContent: 'center',
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        margin: 3,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      buttonAbsen: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
        height: 150,
        margin: 3,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
});

export default styles;