import React, { Component } from "react";
import DatePicker from 'react-native-datepicker';
import TimePicker from "react-native-24h-timepicker";

import {
    Alert,
    AsyncStorage,
    ActivityIndicator,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
    //WebView,
} from "react-native";
import {
    Avatar,
    Button,
    Card,
    Input,
    Icon,
    Text,
    Overlay,
} from "react-native-elements";
import { WebView } from 'react-native-webview';

import { place_order, get_product_detail, cancel_order } from "../services/Api";

export default class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            order_quantity: 0,
            product_id: 0,
            selected_product: undefined,
            total_amount: 0,
            isModalVisible: false,
            approval_url: undefined,
            payment_token: undefined,
            delivery_date:new Date(),
            delivery_time:new Date(),
            customer_address: undefined,
        };
    }

    static navigationOptions = {
        title: "Order"
    };



    // used for first initialized OrderScreen
    componentDidMount() {
        // get selected product id from ProductsScreen
        // called from navigate('Order', {product_id: item_id}) in ProductsScreen
        const product_id = this.props.navigation.getParam("product_id");
        if (product_id != undefined) {
            // update the product_id variable in state
            this.setState({product_id: product_id});
            // refresh product detail
            this.performRefresh(product_id);
        }
    }

    // used for everytime users select new product from ProductsScreen
    componentWillReceiveProps(new_props) {
        // get the new product_id from ProdcutsScreen
        // called from navigate('Order', {product_id: item_id}) in ProductsScreen
        const product_id = new_props.navigation.getParam("product_id");
        if (product_id != undefined) {
            // update the product_id variable in state
            this.setState({product_id: product_id});
            // refresh product detail
            this.performRefresh(product_id);
        }
    }


    // used to refesh product detail from server
    performRefresh = async (id) => {
        // get the id from passing arguments
        // if not found, get it from state.product_id
        if (id === undefined) {
            id = this.state.product_id
        }
        // set isLoading & refreshing to true for showing ActivityIndicator
        // known as loading circle
        this.setState({
            isLoading: true,
            refreshing: true
        });
        // get updated product detail from server by using get_product_detail()
        const product = await get_product_detail(id)
        // if product get successfully from server
        if (product.id !== undefined){
            this.setState({
                isLoading: false,
                refreshing: false,
                selected_product: product
            });
        } else {
            // if product get failure from server
            this.setState({
                isLoading: false,
                refreshing: false,
            });
        }
    };

    // following function is used to when user input qty in textfield
    inputQty = number => {
        const product = this.state.selected_product;
        const old_total = this.state.total_amount;

        if (number > product.quantity) {
            number = product.quantity;
        }
        if (number != null) {
            total = number * product.price;
        }
        // after caculation, update the total amount and order quantity
        // to state for update UI components
        this.setState({
            order_quantity: number,
            total_amount: total
        });
    };

    onCloseOverlay = () => {
        this.setState({ isModalVisible: false })
        if (this.state.selected_product == undefined) {
            cancel_order(this.state.payment_token);
        }
    }

    // submit button action
    onPressSubmit = () => {
        // get all 3 variable from state
        const { selected_product, 
                order_quantity, 
                total_amount, 
                delivery_date, 
                delivery_time, 
                customer_address
        } = this.state;
        //console.debug("Submited orders:");
        // console.debug(
        //     selected_product.id + ":order=" + order_quantity + ":total_amount=" + total_amount
        // );

        // following checking prevent users no input or invalid input
        if (total_amount == 0 || order_quantity == 0) {
            Alert.alert(
                'Warning',
                'Please input your need',
                [
                    { text: 'OK' },
                ], { cancelable: false },
            );
            // after return, function will terminated
            return
        }
        // place_order() is a function import from servers/api.js
        /*
        In api.js:
            place_order(order)
        In here:
            place_order({......})
        It means:
            here's {......} will become order in api.js
            order = {......}, so that we can access these 3 variable in order variable
            eg:
                order={
                    product_id: 1,
                    quantity: 10,
                    total_amount: 100
                }
        */
        place_order({
            product_id: selected_product.id,
            quantity: order_quantity,
            total_amount: total_amount,
            delivery_date: delivery_date,
            delivery_time: delivery_time,
            customer_address: customer_address, 
        }).then(response => {
            // using then to handle next operation after received response
            if (response.approval_url !== undefined) {
                this.setState({
                    selected_product: undefined,
                    order_quantity: 0,
                    total_amount: 0,
                    isModalVisible: true,
                    approval_url: response.approval_url,
                    payment_token: response.payment_token,
                });
                this.props.navigation.navigate("Products")
            }
        });
    };

    // this is the main function to display a page
    render() {
        const selected_product = this.state.selected_product;

        // following means that data is not ready
        // will display a ActivityIndicator (loading animation)
        let content_view;
        if (this.state.isLoading) {
            contentView = (
            <View style={{ flex: 1, padding: 20 }}>
                <ActivityIndicator />
            </View>
            );
        }

        // If not loading
        if (selected_product === undefined) {
            // If selected product is empty, show no product message
            contentView = (
                 <View style={{ flex: 1, justifyContent:'center', alignItems: 'center'}}>

                <Image
                    source={require("../assets/images/nopro.png")}
                    style={styles.image}
                  />

                <Text style={ {fontSize:22}}> Please select a product from list first! </Text>
                </View>
            );
        } else {
            // If selected product is not empty
            // display detail
            contentView = (

                <Card title={selected_product.name}>
                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                    <Avatar
                        size={120}
                        borderColor="black"
                        borderWidth={3}
                        source={{ uri: selected_product.picture }}
                        activeOpacity={0.7}
                    />
                    </View>

                    <Text style={ {height: 17, fontSize: 16, marginTop:4}}>
                        Description: {selected_product.description}
                    </Text>

                    <Text style={ {height: 17, fontSize: 16, marginTop:4}}>
                        Quantity: {selected_product.quantity}
                    </Text>

                    <Text style={ {height: 17, fontSize: 16, marginTop:4}}>
                        Discount: {selected_product.discount}
                    </Text>

                    <Text style={ {height: 17, fontSize: 16, marginTop:4}}>
                        Price: {selected_product.price}
                    </Text>

                    <Input 
                        label="Input your need:"
                        containerStyle={{
                            borderWidth: 2, // size/width of the border
                            borderColor: "lightgrey", // color of the border
                            marginVertical: 10,
                            marginTop:10
                        }}
                        keyboardType="numeric"
                        value={`${this.state.order_quantity}`}
                        onChangeText={this.inputQty}
                        clearTextOnFocus={true} //only work on IOS
                    />

                     <Text style={ {height: 20, fontSize: 17, fontWeight: "bold", marginTop:4}}>
                        Please select a delivery date! 
                     </Text>

                     <DatePicker
                        style={{width: 200, marginTop: 8}}
                        
                        date={this.state.delivery_date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={this.state.delivery_date}
                        maxDate="2021-09-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                        }}
                        onDateChange={(date) => {this.setState({delivery_date: date})}}
                      />

                     <Text style={ {height: 20, fontSize: 17, fontWeight: "bold", marginTop:4}}> 
                        Please select a delivery time! 
                     </Text>

                     <DatePicker
                        style={{width: 200, marginTop: 4}}
                        date={this.state.delivery_time}
                        mode="time"
                        placeholder="select date"
                        format="h:mm:a"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 6,
                            marginLeft: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                        }}
                        onDateChange={(time) => {this.setState({delivery_time: time})}}
                      />


                    <Text style={ {height: 20, fontSize: 17, fontWeight: "bold", marginTop:4}}> 
                        Delivery Address 
                    </Text>

                    <TextInput
                          placeholder="Please type your address!"
                          style={{ height: 40, borderColor: 'gray', borderWidth: 1 ,marginTop:10}}
                          onChangeText={text => {this.setState({customer_address: text})}}
                    />

                    <Text style={ {height: 20, fontSize: 17, fontWeight: "bold", marginTop:4}}> 
                        Total Amount: {this.state.total_amount}
                    </Text>

                    <Button
                        title="ORDER"
                        icon={{ name: "payment" }}
                        backgroundColor="#03A9F4"
                        buttonStyle={{ borderRadius: 0, marginTop: 20 }}
                        onPress={this.onPressSubmit}
                    />
                </Card>
            );
        }

        // render Order Screen
        return (
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: "center",
                    paddingTop: 20,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.performRefresh}
                    />
                }>

                <Overlay
                    isVisible={this.state.isModalVisible}
                    onRequestClose={this.onCloseOverlay}
                    onBackdropPress={this.onCloseOverlay}
                >

                    <WebView source={{ uri: this.state.approval_url }} />

                </Overlay>

                {contentView}

            </ScrollView>          
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20
  },
  image: {
    resizeMode: "contain",
    width: "50%",
    height: "50%",
    marginBottom: 10
  },
});

