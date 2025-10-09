import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomTabs } from "./navigation/BottomTabs";
import { Details } from './screens/Details';
import { EditProduct } from "./screens/EditProduct";
import { Editprofile } from "./screens/Editprofile";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureDirection: "horizontal",
          animation: "slide_from_right",
        }}>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name='Details' component={Details}/>
          <Stack.Screen name="Edit" component={EditProduct}/>
          <Stack.Screen name="EditProfile" component={Editprofile}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App

