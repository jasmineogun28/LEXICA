import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#219ebc',
      alignItems: 'center',
      justifyContent: 'flex-start', // Ensure content is aligned at the top
      paddingTop: 20, // Padding to make it look better
    },
    text: {
      fontSize: 20,
      color: '#023047',
      textAlign: 'left', // Changed to left alignment for better readability
      marginBottom: 10, // Added margin to separate text elements
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: '#8ECAE6',
      textAlign: 'center', // Centered title
    },
    responseContainer: {
      flex: 1,
      width: '90%',
      maxHeight: 500, // Adjust this value to control the max height of the scrollable area
      backgroundColor: '#f9f9f9',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 15,
      marginTop: 20,
    },
    scrollView: {
      flexGrow: 1, // Ensures the scroll grows to fill available space
    },
});

export default styles;
