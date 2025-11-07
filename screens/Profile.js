import * as Linkings from "expo-linking";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

export const Profile = ({ navigation, route }) => {
  const [userProfile, setUserProfile] = useState({
    name: "Sahil",
    email: "sahil@gmail.com",
    phoneNo: "7483091077",
    address: "banglore",
    base64Image: null,
  });
  const user = route?.params?.user;
  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <TouchableOpacity
        style={styles.edit}
        onPress={() => navigation.navigate("EditProfile", { userProfile })}
      >
        <Ionicons name="pencil-outline" size={25} />
      </TouchableOpacity>
      <View style={styles.profilepic}>
        {userProfile.base64Image ? (
          <Image
            source={{
              uri: `data:image/jpeg;base64,${userProfile.base64Image}`,
            }}
            style={{
              height: 150,
              width: 150,
              borderRadius: 150 / 2,
              resizeMode: "stretch",
            }}
          />
        ) : (
          <Ionicons name="person-outline" size={100}></Ionicons>
        )}
      </View>
      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>{userProfile.name}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{userProfile.email}</Text>

      <Text style={styles.label}>Phone no</Text>
      <Text style={styles.value}>{userProfile.phoneNo}</Text>

      <Text style={styles.label}>Address</Text>
      <Text style={styles.value}>{userProfile.address}</Text>

      <TouchableOpacity style={styles.button} onPress={()=>{Linkings.openURL("https://docs.expo.dev/") }}>
        <Text style={styles.buttonText}>Open expo doc using expo-linking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Link style={styles.buttonText} href={"https://docs.expo.dev/"}>Open expo doc using expo-router</Link>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={()=>{Linking.openURL("https://docs.expo.dev/") }}>
        <Text style={styles.buttonText}>Open expo doc using react-native linking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b8d4c3ff",
    paddingHorizontal: 10,
    rowGap: 10,
  },
  header: { fontSize: 35, textAlign: "center" },
  profilepic: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: "50%",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    alignItems: "center",
  },
  options: { alignSelf: "center", flexDirection: "row", gap: 20 },
  label: {
    fontSize: 20,
    color: "#3268a8",
  },
  value: {
    fontSize: 20,
    fontWeight: "500",
  },
  edit: {
    position: "absolute",
    right: 20,
    top: 40,
  },
  button:{
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c6977ff",
    borderRadius: 10,
    padding: 10,
  },
  buttonText:{
    color:"#fff"
  }
});
