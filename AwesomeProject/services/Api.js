import { AsyncStorage } from "react-native";

var BASE_API_URL = "http://192.168.0.100:8000/";
var API_TOKEN = "Token 50e3587538f9a2e56b6b78e8deff3a5e0d4b3605";

export const login = (username, password) => {
  if (username == "" || password == "") {
    return;
  }

  var data = { username: username, password: password };
  var url = BASE_API_URL + "api-token-auth/";
  console.log("POST : " + url);

  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => response.json()) // parses response to JSON
    .then(jsonResponse => {
      return jsonResponse;
    })
    .catch(err => console.log("Login failure:\n" + err));
};

export const register = (username, password) => {

  var data = { username: username, password: password };
  var url = BASE_API_URL + "users/";
  console.log("POST : " + url);

  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "Authorization": API_TOKEN,
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => response.json()) // parses response to JSON
    .then(jsonResponse => {
        console.log("successful")
        return login(jsonResponse.username, password);
    })
    .catch(err => console.log("Register failure:\n" + err));
};

export const place_order = async (order) => {
  user_id = await get_user_info("user_id");
  const { product_id, quantity, total_amount, delivery_date, delivery_time, customer_address } = order;
  token = "Token " + (await get_user_info("user_token"));
  data = {
    customer: user_id,
    product: product_id,
    quantity: quantity,
    total_amount: total_amount,
    delivery_date: delivery_date,
    delivery_time: delivery_time,
    customer_address: customer_address,
  };
  var url = BASE_API_URL + "payment/";
  console.log("POST : " + url);
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => response.json()) // parses response to JSON
    .then(jsonResponse => {
      console.log("Server create payment successful.")
      console.log(jsonResponse)
      return jsonResponse;
    })
    .catch(err => console.log("Order got error:\n" + err));
};

export const cancel_order = (payment_token) => {
  var url = BASE_API_URL + "cancel/?token=" + payment_token;
  console.log("GET : " + url);
  return fetch(url)
    .then(response => console.log("Order cancelled"))
}

export const get_products_list = async () => {
  var url = BASE_API_URL + "products/";
  console.log("GET : " + url);
  token = "Token " + (await get_user_info("user_token"));
  return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log("successful.")
      return responseJson;
    })
    .catch(error => {
      console.error("GET product list failure:\n" + error);
    });
};

export const get_orders_list = async () => {
  var url = BASE_API_URL + "orders/";
  console.log("GET : " + url);
  token = "Token " + (await get_user_info("user_token"));
  return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log("successful.")
      return responseJson;
    })
    .catch(error => {
      console.error("GET order list failure:\n" + error);
    });
};

export const get_product_detail = async (product_id) => {
  var url = BASE_API_URL + "products/" + product_id+ "/";
  console.log("GET : " + url);
  token = "Token " + (await get_user_info("user_token"));
  return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log("successful")
      return responseJson;
    })
    .catch(error => {
      console.log("GET product detail failure.");
      console.error(error)
      return error;
    });
}


export const get_user_info = async (info) => {
  try {
    const value = await AsyncStorage.getItem(info);
    if (value !== null) {
      console.log("getting " + info + " successful");
      return value;
    }
  } catch (error) {
    console.log("getting " + info + "failure.");
    console.error(error)
  }
};

