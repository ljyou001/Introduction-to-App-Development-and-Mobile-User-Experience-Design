import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
  HomeScreen.navigationOptions = {
  header: null,
};

  return (
      <View style={styles.container}>
        <Text>ReactNative Tutorial</Text>
        <Input
          placeholder='USERNAME'
          leftIcon={
            <Icon
              name='person'
              size={24}
              color='black'
            />
          }
        />
        <Input
          placeholder='PASSWORD'
          leftIcon={
            <Icon
              name='lock'
              size={24}
              color='black'
            />
          }
        />
        <Button
          title="LOGIN"
        />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});