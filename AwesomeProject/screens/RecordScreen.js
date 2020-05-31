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


import { get_orders_list } from '../services/Api';



export default class RecordScreen extends Component {
  componentsMounted = false;

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
    }
    //this.pressedAdd = this.pressedAdd.bind(this)
  }

  static navigationOptions = {
    title: 'Record',
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

    return get_orders_list().then(response => {
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
    get_orders_list().then(response => {
      this.setState({
        isLoading: false,
        dataSource: response.results,
        refreshing: false,
      });
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
          centerComponent={{ text: 'Invoice' }}
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
            keyExtractor={item => item.payment_id}
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
                  ID: {item.id}

                  </Text>
                }
                subtitle={
                  <View>
                    <Text style={ {height: 20, fontSize: 16, fontWeight: "bold", marginTop:4}}>
                      Invoice No: {item.invoice_no}
                    </Text>
                    <Text style={ {height: 20, fontSize: 14, marginTop:4}}>
                      Quantity: {item.quantity}
                    </Text>
                    <Text style={ {height: 20, fontSize: 14, marginTop:4}}>
                      Total amount: ${item.total_amount}
                    </Text>
                    <Text style={ {height: 20, fontSize: 14, marginTop:4}}>
                      Create time: {item.created}
                    </Text>
                    <Text style={ {height: 20, fontSize: 14, marginTop:4}}>
                        Delivery time: {item.delivery_date} {item.delivery_time}
                    </Text>
                  </View>
                }
                rightIcon={{ name:"check" }}

              />
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

