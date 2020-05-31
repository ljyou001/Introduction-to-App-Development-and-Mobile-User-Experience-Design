import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import Icon from '../components/Icon'

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import ProductsScreen from '../screens/ProductsScreen';
import OrderScreen from '../screens/OrderScreen';
import RecordScreen from '../screens/RecordScreen';
import ProfileScreen from '../screens/ProfileScreen';

const LoginStack = createStackNavigator(
  {
    Login: {screen: LoginScreen},
    Register: {screen: RegisterScreen},
  }
);

const HomeStack = createBottomTabNavigator(
  {
  Products: {
    screen: ProductsScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="product" color={tintColor} />
    }
  },
  Order: {screen: OrderScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="order" color={tintColor} />
    }
  },
  Record: {screen: RecordScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="record" color={tintColor} />
    }
  },
  Profile: {screen: ProfileScreen,
   navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="profile" color={tintColor} />}
    }
  },
  {
    headerMode: 'none',
  }
);


export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: LoginStack,
    App: HomeStack,
  },
  {
    initialRouteName: 'App',
    headerMode: 'none',
  }
);







