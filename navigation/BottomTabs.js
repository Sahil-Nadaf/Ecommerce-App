import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AddProduct } from "../screens/AddProduct";
import { Cart } from "../screens/Cart";
import { Home } from "../screens/Home";
import { Orders } from "../screens/Orders";
import { Profile } from "../screens/Profile";

const Tab = createBottomTabNavigator();

export const BottomTabs =()=> {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "AddProduct") {
            iconName = "add-outline";
            size=30
          } else if (route.name === "Cart") {
            iconName = "cart-outline";
            size=30
          } else if (route.name === "Home") {
            iconName = "home-outline";
            size=30
          } else if (route.name === "Profile") {
            iconName = "person-outline";
            size=30
          }else if (route.name === "My Orders") {
            iconName = "cube-outline";
            size=30
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
      
    >
        <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="AddProduct" component={AddProduct} />
      <Tab.Screen name="My Orders" component={Orders}/>
      <Tab.Screen name="Profile" component={Profile}/>
      <Tab.Screen name="Cart" component={Cart} />
    </Tab.Navigator>
  );
}
