import React, {Component} from 'react';
import {
  AsyncStorage,
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {
  Button
} from 'react-native-elements';


//import { register } from '../services/Api';


export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent:'center', alignItems: 'center', marginTop:20 }}>

      <Text style={ {fontSize:28}}>ISEM Group 4</Text>

          <Image
            source={require("../assets/images/fruit-box.jpg")}
            style={styles.image}
          />

        <Button
          // submit button
          title='Logout'
          onPress={ () => this.logout() }
        />
      </View>
    )
  }

  logout = async () => {
    // Authentication Part
    let keys = ['user_id', 'user_email', 'user_token'];
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20
  },
  imageBackground: {
    width: "100%",
    height: "100%"
  },
  image: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
    marginBottom: 10
  },
});
