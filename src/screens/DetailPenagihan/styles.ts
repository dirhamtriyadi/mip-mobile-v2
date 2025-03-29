import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    containerSiganture: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 250,
        padding: 10,
      },
      row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
      },
      formContainer: {
        width: '90%',
        marginHorizontal: '5%',
      },
      fieldLabel: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
      },
      fieldInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
      },
      lockedText: {
        textAlign: 'center',
        color: '#888',
      },
      signatureImage: {
        width: 335,
        height: 114,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
      },
});

export default styles;