import React, { Component } from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  List,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {
  Divider,
  Header,
  ListItem,
} from 'react-native-elements'


import { get_products_list } from '../services/Api';



export default class ProductsScreen extends Component {
  componentsMounted = false;

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
    }
    this.pressedAdd = this.pressedAdd.bind(this)
  }

  static navigationOptions = {
    title: 'Product',
  };

  // componentDidMount means preparation before display the page
  // in following, it does getting data from server
  componentDidMount() {
    this.componentsMounted = true;
    if (this.componentsMounted) {
      AsyncStorage.getItem("username").then((username) => {
        console.log(username);
        this.setState({
          username: username,
        });
      });
    }

    return get_products_list().then(response => {
      if(response.detail == "Invalid token.") {
        this.props.navigation.navigate('Login');
      }
      if (this.componentsMounted) {
        this.setState({
          isLoading: false,
          dataSource: response.results,
          refreshing: false,
        });
      }
    });


  }

  componentWillUnmount() {
    this.componentsMounted = false;
  }

  // following function is for drag the page down for refresh data
  pressRefresh = () => {
    this.setState({refreshing: true});
    get_products_list().then(response => {
      this.setState({
        isLoading: false,
        dataSource: response.results,
        refreshing: false,
      });
    });
  }

  pressedAdd = (item_id) => {
    // console.log("Pressed Add", item)
    this.props.navigation.navigate('Order', {
      product_id: item_id
    });
  }

  // this is the main function to display a page
  render() {
    // following means that data is not ready
    // will display a ActivityIndicator (loading animation)
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    const {username} = this.state
    // If data is reading
    // render the product list
    return(
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Welcome, ' + username, style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}        
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.pressRefresh}
            />
          }>
          <FlatList
            data={this.state.dataSource}
            keyExtractor={item => item.name}
            renderItem={({item}) => (
              <ListItem
                title={                
                  <Text
                    style={{
                    color: 'purple',
                    fontWeight: 'bold',
                    fontSize: 20,
                    }}
                  >
                  {item.name}

                  </Text>
                }
                subtitle={
                  <View>
                    <Text style={ {height: 20, fontSize: 16, fontWeight: "bold", marginTop:4}}>
                      {item.description}
                    </Text>
                    <Text style={ {height: 20, fontSize: 14, marginTop:4}}>
                      Price: ${item.price}</Text>
                    <Text>Last Update: {item.updated}</Text>
                  </View>
                }
                leftAvatar={{ source : {uri:item.picture} }}
                rightIcon={{ name:"shopping-cart" }}

                onPress={() => this.pressedAdd(item.id)}
              />
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

