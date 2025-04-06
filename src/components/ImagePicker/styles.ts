import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  groupField: {
    width: '100%',
    marginVertical: 5,
  },
  fieldLabel: {
    fontSize: 16,
    // marginBottom: 10,
    fontWeight: 'bold',
  },
  btnContainer: {
    width: '100%',
    flexDirection: 'row',
    // marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    height: 47,
    backgroundColor: '#fff',
  },
  btnText: {
    color: '#242c40',
  },
  btn: {
    width: '50%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  btnIcon: {
    position: 'absolute',
    right: 10,
  },
  imgContainer: {
    width: '100%',
    height: 200,
    // marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default styles;
