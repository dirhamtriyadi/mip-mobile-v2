import { StyleSheet } from "react-native";

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
    fieldInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    textInput: {
        color: '#242c40'
    },
    btnIcon: {
        position: 'absolute',
        right: 10
    },
    map: {
        width: '100%',
        height: 200,
        // marginBottom: 10,
        marginTop: -10
    }
});

export default styles;