import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';

const Header: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logo}>Flashcards</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },
  logo: {
    fontSize: 16,
    fontWeight: 900,
    color: '#000000'
  },
  logoImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  heroContainer: {
    height: '10%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    marginTop: 10,
  },
  heroTitle: {
    color: '#283537',
    fontSize: 28,
  },
  heroSubTitle: {
    fontSize: 16,
  },
  contentContainer: {
    height: '80%',
    width: '90%',
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#283537',
    fontSize: 20,
    paddingHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#eceae4',
    fontSize: 16,
  },
  highlightedText: {
    color: '#ffcd64',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 16,
  },
  text: {
    color: '#000',
    fontSize: 16, 
  },
  icon: {
    height: 50,
    width: 50,
    margin: 10,
    marginRight: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#555'
  },
  titleText: {
    fontSize: 20,
    color: '#222'
  },
});

export default Header;
