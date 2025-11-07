import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { fetchProductById } from "./components/fetchProductById";
import { BottomTabs } from "./navigation/BottomTabs";
import { Details } from "./screens/Details";
import { EditProduct } from "./screens/EditProduct";
import { Editprofile } from "./screens/Editprofile";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["ecommerceapp://"],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Home: "home",
          AddProduct: "addproduct",
          "My Orders": "orders",
          Profile: "profile",
          Cart: "cart",
        },
      },
      Details: "details/:id",
      Edit: "edit/:id",
      EditProfile: "editprofile",
    },
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const registerForNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("permission not granted");
    return;
  }
  // const projectId =
  //   Constants?.expoConfig?.extra?.eas?.projectId ||
  //   Constants?.easConfig?.projectId;
  // console.log(projectId);
  
  // try {
  //   const pushTokenString = (
  //     await Notifications.getExpoPushTokenAsync({ projectId })
  //   ).data;
  //   console.log("Expo Push Token:", pushTokenString);
  //   return pushTokenString;
  // } catch (e) {
  //   console.log("Error fetching Expo push token:", e);
  // }
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const handleNotificationNavigation = async (response) => {
    const data = response.notification.request.content.data;
    if (data?.pid) {
      const product = await fetchProductById(data.pid);
      if (product && navigationRef.isReady()) {
        navigationRef.navigate("Details", { product: product });
      }else {
        const interval = setInterval(() => {
          if (navigationRef.isReady()) {
            navigationRef.navigate("Details", { product:product });
            clearInterval(interval);
          }
        }, 100);
      }
    }
  };
  useEffect(() => {
    registerForNotificationsAsync();
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationNavigation
      );
    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      handleNotificationNavigation(lastResponse);
    }
    return () => {
      responseListener.remove();
    };
  }, []);

  const url = Linking.useURL();
  console.log("URL:", { url });
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      console.log("App opened with deep link:", url);
      const parsed = Linking.parse(url);
      console.log("Parsed deep link:", parsed);
    };

    const sub = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        console.log("App launched with deep link:", initialUrl);
        handleDeepLink({ url: initialUrl });
      }
    });

    return () => sub.remove();
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Edit" component={EditProduct} />
          <Stack.Screen name="EditProfile" component={Editprofile} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
