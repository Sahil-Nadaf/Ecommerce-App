import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserInput } from "../components/UserInput";
export const Editprofile = ({ navigation, route }) => {
  const userProfile = route?.params?.userProfile;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhoneNo(userProfile.phoneNo);
      setAddress(userProfile.address);
      setBase64Image(userProfile.base64Image);
    }
  }, [userProfile]);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64Image = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        { encoding: "base64" }
      );
      setBase64Image(base64Image);
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64Image = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
        { encoding: "base64" }
      );
      setBase64Image(base64Image);
    }
  };

  const editProfile = () => {
    const user = {
      name,
      email,
      phoneNo,
      address,
      base64Image,
    };
    navigation.navigate("MainTabs", { screen: "Profile", params: { user } });
  };

  const handleEditProfile = () => {
    if (!name || !email || !address || !phoneNo) {
      Alert.alert("Please fill all fields");
      return;
    }
    Alert.alert("Edit Profile", "Are you sure, you want to edit profile", [
      { text: "Edit", onPress: editProfile },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveImage=()=>{
    setBase64Image(null)
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <View style={{ rowGap: 10 }}>
        <UserInput
          placeholder="Enter user name"
          label="User name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />
        <UserInput
          placeholder="Enter Email"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
        />
        <UserInput
          placeholder="Enter phone no"
          label="Phone No"
          value={phoneNo}
          onChangeText={setPhoneNo}
          keyboardType="numeric"
        />
        <UserInput
          placeholder="Enter address"
          label="Address"
          value={address}
          onChangeText={setAddress}
          keyboardType="default"
        />

        <View style={styles.imagecontainer}>
          <Text style={styles.imagetitle}>Select profile image</Text>
          {!base64Image && (
            <View style={styles.card}>
              <TouchableOpacity style={styles.option} onPress={pickFromCamera}>
                <Ionicons name="camera-outline" size={40} color="#f4b400" />
                <Text style={styles.label}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={pickFromGallery}>
                <Ionicons name="image-outline" size={40} color="#00bcd4" />
                <Text style={styles.label}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}
          {base64Image && (
            <View>
              <Image
                source={{ uri: `data:image/jpeg;base64,${base64Image}` }}
                style={{ width: "100%", height: 300, resizeMode: "stretch" }}
              />
              <TouchableOpacity
                onPress={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 15,
                  padding: 3,
                  zIndex: 1,
                }}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={{ color: "#fff" }}>Edit Profile</Text>
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
  header: { flexDirection: "row", alignItems: "center", width: "100%" },
  title: { fontSize: 35, flex: 1, textAlign: "center" },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c6977ff",
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 15,
    right: 10,
    left: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 2,
    resizeMode: "stretch",
  },
  imagecontainer: {
    gap: 10,
  },
  imagetitle: {
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffff",
    borderRadius: 12,
    paddingVertical: 30,
  },
  option: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  contentContainerStyle: { gap: 10, width: "100%", paddingBottom: 375 },
  imageview: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 15,
    padding: 5,
    overflow: "hidden",
  },
});
