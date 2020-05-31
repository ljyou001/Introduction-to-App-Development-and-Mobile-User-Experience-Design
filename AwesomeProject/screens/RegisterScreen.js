import React, { Component } from "react";
import {
  AsyncStorage,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import {
  Button,
  Input,
} from "react-native-elements";

export default class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
        username:"",
        password:"",
        password2:"",
        isError: false,
        notMatch: false
    };
  }

  static navigationOptions = {
    title: "Sign Up",
  };

onPressRegister = () => {
  const {username, password, password2}= this.state;
  console.log(username);
  console.log(password);
  console.log(password2);
  if (username != "wilson") {
    this.setState({ isError: true});
  } else {
    this.setState({ isError: false});
  }
  if (password == password2) {
    this.setState({ notMatch: false});
  } else {
    this.setState({ notMatch: true});
  }
}

  inputUsername = value => {
    this.setState({username: value});
  };

  inputPassword = value => {
    this.setState({password:value});
  };

  inputPassword2 = value => {
    this.setState({password2:value});
  };



  render() {
      const {navigate}= this.props.navigation;
      let errorMessage = null;
      if (this.state.isError) {
        errorMessage = "Your username is incorrect!";
      } else if (this.state.notMatch) {
        errorMessage = "2 passwords must be same! Please verify again!";
      }

    return (

    <ImageBackground
      source={require("../assets/images/background_2633962_960_720_by_b0mbsh8llresources_dc4yaor-fullview.jpg")}
      style={styles.imageBG}
    >
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          resizeMode:"contain",
          width:"50%",
          height:"50%",
          marginBottom:10
        }}
      />
    <Input
      placeholder="Your USERNAME"
      returnKeyType="go"
      textContentType="username"
      containerStyle={styles.inputContainer}
      inputContainerStyle={styles.inputField}
      underlineColorAndroid="white"
      onChangeText={value => this.inputUsername(value)}
    />
    <Input
      placeholder="Your PASSWORD"
      returnKeyType="next"
      secureTextEntry
      textContentType="password"
      containerStyle={styles.inputContainer}
      inputContainerStyle={styles.inputField}
      underlineColorAndroid="white"
      onChangeText={value => this.inputPassword(value)}
    />
    <Input
      placeholder="Confirm PASSWORD"
      returnKeyType="go"
      secureTextEntry
      textContentType="password"
      containerStyle={styles.inputContainer}
      inputContainerStyle={styles.inputField}
      underlineColorAndroid="white"
      onChangeText={value =>this.inputPassword2(value)}
      errorStyle={{color:'red'}}
      errorMessage={errorMessage}
    />

    <Button
      title="Register"
      containerStyle={styles.registerButton}
      textStyle={styles.buttonText}
      onPress={this.onPressRegister}
    />

    <Button
      title="Back to Login"
      type="clear"
      onPress={()=>navigate("Login")}
    />

    </ScrollView>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  // background image style
  imageBG: {
    width: "100%",
    height: "100%"
  },
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginVertical:20
  },
  inputContainer:{
    marginVertical:5
  },
  inputField:{
    backgroundColor: "white",
    opacity: 0.7,
    borderRadius:15
  },
  registerButton:{
    backgroundColor: "blue",
    borderRadius:15,
    marginTop:20
  },
  buttonText:{
    fontSize:20,
    fontWeight: "bold"
  },
});










