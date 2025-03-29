import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  accordionContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    backgroundColor: '#ddd',
    padding: 15,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});

export default styles;
