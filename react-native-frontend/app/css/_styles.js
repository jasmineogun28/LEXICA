import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#c0eef0',
      alignItems: 'center',
      justifyContent: 'center', 
      paddingTop: 80, 
      paddingBottom: 20,
    },
    text: {
      fontSize: 30,
      color: '#023047',
      textAlign: 'left', 
      marginBottom: 10, 
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#023047',
      textAlign: 'center', 
    },
    responseContainer: {
      flex: 1,
      width: '90%',
      maxHeight: 500, 
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 15,
      marginTop: 20,
    },
    scrollView: {
      flexGrow: 1, 
    },
});

export default styles;
