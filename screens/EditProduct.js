import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserInput } from "../components/UserInput";
import { db } from "../firestore/firebaseConfig";

export const EditProduct = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  // const [images, setImages]=useState([])  //local images
  // const [editingProductImages, setEditingProductImages]=useState([]) //base64Images
  const [combinedImages, setCombinedImages] = useState([]); // images + editingProductImages
  // const [base64Images,setBase64Images]=useState([])

  const editingProduct = route.params?.product;

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      // setEditingProductImages(editingProduct.images)
      setCombinedImages(editingProduct.images);
      // setBase64Images(editingProduct.images)
    }
  }, [editingProduct]);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      // setImages((prev)=>[...prev,...result.assets])
      // console.log(result.assets[0])
      // setCombinedImages((prev)=>[...prev,...result.assets])
      const base64Array = await Promise.all(
        result.assets.map(async (asset) => {
          return await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64",
          });
        })
      );
      setCombinedImages((prev) => [...prev, ...base64Array]);
    }
  };
  // console.log(combinedImages.length);

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // setImages((prev)=>[...prev,...result.assets])
      // setCombinedImages((prev)=>[...prev,...result.assets])
      const base64Array = await Promise.all(
        result.assets.map(async (asset) => {
          return await FileSystem.readAsStringAsync(asset.uri, {
            encoding: "base64",
          });
        })
      );
      setCombinedImages((prev) => [...prev, ...base64Array]);
    }
  };
  const addImage = () => {
    Alert.alert("Add image", "select your option", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const editProduct = async () => {
    try {
      const updatedProduct = {
        createdAt: editingProduct.createdAt,
        name,
        category,
        price,
        images: combinedImages,
        updatedAt: serverTimestamp(),
      };
      const docRef = doc(db, "products", editingProduct.pid);
      await updateDoc(docRef, updatedProduct);

      const q = query(
        collection(db, "cart"),
        where("pid", "==", editingProduct.pid)
      );
      const cartSnap = await getDocs(q);
      const cartUpdates = cartSnap.docs.map((d) =>
        updateDoc(doc(db, "cart", d.id), {
          name,
          category,
          price,
          images: combinedImages,
        })
      );
      await Promise.all(cartUpdates);
      setName("");
      setCategory("");
      setPrice("");
      setCombinedImages([]);
      if (route.params?.onSave) {
        route.params.onSave(updatedProduct);
      }
      navigation.goBack();
    } catch (e) {
      console.log(e);
      Alert.alert("Error editing product");
    }
  };

  const deleteProduct = async () => {
    try {
      await deleteDoc(doc(db, "products", editingProduct.pid));
      const q = query(collection(db, "cart"), where("pid", "==", editingProduct.pid));
    const cartSnap = await getDocs(q);
    const deletePromises = cartSnap.docs.map((docItem) =>
      deleteDoc(doc(db, "cart", docItem.id))
    );

    const qr = query(collection(db, "orders"), where("pid", "==", editingProduct.pid));
    const ordersSnap = await getDocs(qr);
    const deleteMatching = ordersSnap.docs.map((docItem) =>
      deleteDoc(doc(db, "orders", docItem.id))
    );


    await Promise.all(deletePromises);
    await Promise.all(deleteMatching);
      navigation.navigate("MainTabs", { screen: "Home" });
    } catch (err) {
      console.error("Error deleting product: ", err);
    }
  };

  const handleDeleteProduct = () => {
    Alert.alert("Delete Product", "Are you sure you want to delete product?", [
      {
        text: "Delete",
        onPress: deleteProduct,
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleEditProduct = () => {
    if (!name || !category || !price || !combinedImages) {
      Alert.alert("Please fill all fields");
      return;
    }
    Alert.alert(
      "Edit Product Details",
      "Are you sure, you want to edit product details",
      [
        { text: "Edit", onPress: editProduct },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };
  // // const combinedImages=[...editingProductImages,...images]
  // const combinedImages=useMemo(()=>
  //   [...editingProductImages,...images]
  // ,[editingProductImages,images])
  // // const dataWithPadding =
  //   // combinedImages.length % 2 === 0 ? combinedImages : [...combinedImages, { empty:true }];
  //   const dataWithPadding=useMemo(()=>{
  //     // const combinedImages=[...editingProductImages,...images]
  //     return(combinedImages.length % 2 === 0 ? combinedImages : [...combinedImages, { empty:true }])
  //   },[images,combinedImages])

  const dataWithPadding =
    combinedImages.length % 2 === 0
      ? combinedImages
      : [...combinedImages, { empty: true }];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Product</Text>
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
          placeholder="Enter product category"
          label="Product category"
          value={category}
          onChangeText={setCategory}
          keyboardType="default"
        />
        <UserInput
          placeholder="Enter product price"
          label="Product price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <View style={styles.imagecontainer}>
          <View>
            <Text style={styles.imagetitle}>Select product cover images</Text>
            {combinedImages.length > 0 && (
              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={addImage}
              >
                <Ionicons name="add-circle-outline" size={35} />
              </TouchableOpacity>
            )}
          </View>

          {combinedImages.length === 0 ? (
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
                const handleRemoveImage = () => {
                  setCombinedImages(
                    combinedImages.filter((_, i) => i !== index)
                  );
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
      <TouchableOpacity style={styles.editButton} onPress={handleEditProduct}>
        <Text style={{ color: "#fff" }}>Edit Product</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteProduct}
      >
        <Text style={{ color: "#fff" }}>Delete Product</Text>
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
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    left: 10,
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c6977ff",
    borderRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 60,
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
