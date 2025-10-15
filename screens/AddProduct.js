import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserInput } from "../components/UserInput";
import { db } from "../firestore/firebaseConfig";

export const AddProduct = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  // const [images, setImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);

  const categories = [
    "Fashion",
    "Mobile",
    "Electronics",
    "Appliances",
    "Beauty and Personal care",
    "Sports",
    "Home",
    "Smart Gadgets",
  ];

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      // setImages((prev) => [...prev, ...result.assets]);
      const base64Array = await Promise.all(
        result.assets.map(async (asset) => {
          return await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64",
          });
        })
      );
      setBase64Images((prev) => [...prev, ...base64Array]);
      // console.log(base64Images);
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
      // setImages((prev) => [...prev, ...result.assets]);
      const base64Array = await Promise.all(
        result.assets.map(async (asset) => {
          return await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64",
          });
        })
      );

      setBase64Images((prev) => [...prev, ...base64Array]);
    }
  };

  const addImage = () => {
    Alert.alert("Add image", "select your option", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const addProduct = async () => {
    try {
      const newProduct = {
        name,
        category,
        price: Number(price),
        brand,
        images: base64Images,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await addDoc(collection(db, "products"), newProduct);
      setName("");
      setCategory("");
      setPrice("");
      setBrand("");
      setBase64Images([]);
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Error adding product");
    }
  };

  const handleAddProduct = () => {
    if (!name || !category || !price || !base64Images || !brand) {
      Alert.alert("Please fill all fields");
      return;
    }
    Alert.alert("Add Product", "Are you sure, you want to add product", [
      { text: "Add", onPress: addProduct },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const dataWithPadding =
    base64Images.length % 2 === 0
      ? base64Images
      : [...base64Images, { empty: true }];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
      </View>
      <View style={{ rowGap: 10 }}>
        <UserInput
          placeholder="Enter product name"
          label="Product name"
          value={name}
          onChangeText={setName}
          keyboardType="default"
        />

        <UserInput
          placeholder="Enter product price"
          label="Product price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <UserInput
          placeholder="Enter product brand"
          label="Product brand"
          value={brand}
          onChangeText={setBrand}
          keyboardType="default"
        />

        <Text>Product category</Text>
        {!category ? (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0c6977ff",
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => setFilterVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Select Category</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text>{category}</Text>
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0c6977ff",
                borderRadius: 10,
                padding: 10,
              }}
              onPress={() => setFilterVisible(true)}
            >
              <Text style={{ color: "#fff" }}>Select Category</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={filterVisible}
          transparent
          onRequestClose={() => {
            setFilterVisible(false);
          }}
          animationType="slide"
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setFilterVisible(false)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Select category</Text>
              <>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryItem,
                      category === cat && {
                        backgroundColor: "#b8d4c3ff",
                      },
                    ]}
                    onPress={() => {
                      setCategory(cat);
                      setFilterVisible(false);
                    }}
                  >
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </>
              <TouchableOpacity
                style={[styles.categoryItem, { backgroundColor: "#eee" }]}
                onPress={() => {
                  setCategory("");
                  setFilterVisible(false);
                }}
              >
                <Text>Clear category</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.imagecontainer}>
          <View>
            <Text style={styles.imagetitle}>Select product cover images</Text>
            {base64Images.length > 0 && (
              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={addImage}
              >
                <Ionicons name="add-circle-outline" size={35} />
              </TouchableOpacity>
            )}
          </View>

          {base64Images.length === 0 ? (
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
          ) : (
            <FlatList
              data={dataWithPadding}
              numColumns={2}
              columnWrapperStyle={{ gap: 10 }}
              contentContainerStyle={styles.contentContainerStyle}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => {
                // if (item.empty){
                //   return(
                //     <View style={{flex:1}}></View>
                //   )

                // }
                const handleRemoveImage = () => {
                  // setImages(images.filter((_, i) => i !== index));
                  setBase64Images(base64Images.filter((_, i) => i !== index));
                };

                if (item.empty) {
                  return <View style={styles.imageview}></View>;
                }

                return (
                  <View
                    style={[styles.imageview, { backgroundColor: "#ffff" }]}
                  >
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${item}` }}
                      style={{
                        flex: 1,
                        width: "100%",
                        resizeMode: "stretch",
                        borderRadius: 10,
                      }}
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
                );
              }}
            />
          )}
        </View>
      </View>
      {/* {image && (
          <TouchableOpacity
            onPress={() => setImage(null)}
            style={{ alignSelf: "flex-end" }}
          >
            <Ionicons name="close-circle" size={35} color="#FF0000" />
          </TouchableOpacity>
        )}
        {image && <Image source={{ uri: image }} style={styles.image} />} */}

      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={{ color: "#fff" }}>Add Product</Text>
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
    bottom: 0,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  categoryItem: { padding: 12, borderRadius: 8, marginBottom: 10 },
});
