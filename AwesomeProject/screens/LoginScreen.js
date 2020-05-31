import React, { Component } from "react";
import {
  AsyncStorage,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import {
  Button,
  Icon,
  Input,
} from "react-native-elements";

import { login } from "../services/Api";

export default class HomeScreen extends Component {
  // using constructor function to initialize state
  constructor(props) {
    super(props); // this must included
    // all self-defined state can initialize in it
    this.state = {
      username: "",
      password: "",
      isError: false
    };
  }

  // navigationOptions used to configure screen
  static navigationOptions = {
    // Setup the page Header
    title: "Sign In"
  };

  // a function for handle the login button pressed
  submitLogin = async (username, password) => {
    // call login function from services/Api.js with username and password
    await login(username, password).then(response => {
      // console.log funcion can help to to display message in console
      // it is useful for debug use
      console.log(response);
      if (response.token != undefined) {
        // AsyncStorage is a react naive build-in component for
        // storing data to mobile local storage
        AsyncStorage.setItem("user_token", response.token);
        AsyncStorage.setItem("user_id", response.user_id.toString());
        AsyncStorage.setItem("username", response.username);
        console.log("Token:"+response.token+" User ID:"+response.user_id.toString()+" Username:"+response.username);
        // following function is used to switch to other screen
        // with the screen name defined in navigation/MainTabNavigator.js
        this.props.navigation.navigate("App");
      } else {
        // use this.setState function to update state
        this.setState({ isError: true });
      }
    });
  };

  // inputUsername is a function handle the username inupt
  inputUsername = (value) => {
    // everytime input value entered, update the username in state
    this.setState({ username: value });
  };

  // inputPassword is a function handle the password inupt
  inputPassword = (value) => {
    this.setState({ password: value });
  };

  // main function to render the UI components
  render() {
    // get the navigate function from this.props.navigation
    // used in line 164
    const { navigate } = this.props.navigation;
    let errorMessage = null;
    if (this.state.isError) {
      errorMessage = "Username / Password invalid. Please try again!";
    }

    // return the UI components
    return (
      // <ImageBackground> component is similar with the web is background-image
      <ImageBackground
        source={require("../assets/images/login_bg.jpeg")}
        style={styles.imageBackground}
        // https://facebook.github.io/react-native/docs/imagebackground
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            // <Image> component displaying different types of images, 
            // including network images, static resources, temporary local images,
            // and images from local disk, such as the camera roll.
            source={require("../assets/images/logo.png")}
            // use style defined below
            style={styles.loginLogo}
            // https://facebook.github.io/react-native/docs/image
          />
          <Input
            // <Input> component from react-native-elements
            placeholder="USERNAME"
            returnKeyType="next"
            textContentType="username"
            // following 2 container style for controlling different container
            // https://react-native-training.github.io/react-native-elements/docs/input.html#styles-explanation
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            underlineColorAndroid="white"
            // onChangeText prop bind to the inputUsername function
            onChangeText={value => this.inputUsername(value)}
            leftIcon={
              <Icon
                name='person'
                size={24}
                color='black'
              />
            }
            // https://react-native-training.github.io/react-native-elements/docs/input.html
          />
          <Input
            placeholder="PASSW0RD"
            // secureTextEntry prop used to masked the input for password input
            secureTextEntry
            returnKeyType="go"
            textContentType="password"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            underlineColorAndroid="white"
            onChangeText={value => this.inputPassword(value)}
            leftIcon={
              <Icon
                name='lock'
                size={24}
                color='black'
              />
            }
            // display error message which defined in line 74-77
            errorMessage={errorMessage}
            // error message styling
            errorStyle={styles.errorMessage}
          />
          <Button
            // <Button> component from react-native-elements 
            // button with text "LOGIN"
            title="LOGIN"
            // button style
            containerStyle={styles.loginButton}
            // button text style
            titleStyle={styles.buttonText}
            // onPress prop bind to submitLogin function to handle submit login
            onPress={() =>
              // when submit login, pass username and password to it
              // whihc 2 variables are store in state
              this.submitLogin(this.state.username, this.state.password)
            }
            // https://react-native-training.github.io/react-native-elements/docs/button.html
          />
          <Button
            // Register button
            title="Register"
            // type can be solid (default), clear and outline
            type="clear"
            titleStyle={styles.registerText}
            // onPress prop bind to navigate function whihc to switch to Register screen
            onPress={() => navigate("Register")}
          />
        </ScrollView>
        {/* </ScrollView> component is a container component to enable scroll function */}
        {/* https://facebook.github.io/react-native/docs/scrollview */}
      </ImageBackground>
    );
  }
}


// defined all UI component style by using StyleSheet in React Native
// A StyleSheet is an abstraction similar to CSS StyleSheets
// https://facebook.github.io/react-native/docs/stylesheet
// Flexbox : https://facebook.github.io/react-native/docs/flexbox
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
  loginLogo: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
    marginBottom: 10
  },
  inputContainer: {
    marginVertical: 5
  },
  input: {
    backgroundColor: "white",
    opacity: 0.7,
    borderRadius: 15
  },
  errorMessage: {
    color: 'red'
  },
  registerText: {
    color: "#00acc1",
    textAlign: "right"
  },
  loginButton: {
    backgroundColor: "#00acc1",
    borderRadius: 15,
    marginVertical: 5
  },
});