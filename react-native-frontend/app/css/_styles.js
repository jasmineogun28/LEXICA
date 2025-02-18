import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#219ebc',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 20,
      color: '#023047',
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#007BFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginHorizontal: 10,
    },
    buttonPressed: {
      backgroundColor: '#0056b3',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#8ECAE6',
    },
    input: {
      width: '30%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      color: 'white',
    },
    result: {
      marginTop: 20,
      fontSize: 18,
      color: 'green',
    },
    status: {
      marginTop: 10,
      fontSize: 16,
      color: '#023047',
    },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%', // Adjust width to your needs
        marginTop: 20, // Adjust the vertical positioning of buttons
        marginBottom: 20,
      },
      status: {
        fontSize: 18,
        marginTop: 10,
      },
      timerContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      timerText: {
        fontSize: 24,
        marginTop: 10,
      },
  });

export default styles;
