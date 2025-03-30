import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  statusVisit: {
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#17a2b8',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    color: '#fff',
  },
  statusPromiseToPay: {
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#ffc107',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    color: 'black',
  },
  statusPay: {
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    color: '#fff',
  },
  statusError: {
    textAlign: 'center',
    borderRadius: 5,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    color: '#fff',
  },
});

export default styles;