import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageCarousel } from "../components/ImageCarousel";
import { db } from "../firestore/firebaseConfig";

export const Details = ({ route, navigation }) => {
  const { product } = route.params;
  const [editedProduct, setEditedProduct] = useState(product);
  const [inCart, setInCart] = useState(false);
  const [inOrders, setInOrders] = useState(false);

  const checkInCart = async () => {
    const q = query(collection(db, "cart"), where("pid", "==", product.pid));
    const snapshot = await getDocs(q);
    setInCart(!snapshot.empty);
  };

  const checkInOrders = async () => {
    const q = query(collection(db, "orders"), where("pid", "==", product.pid));
    const snapshot = await getDocs(q);
    setInOrders(!snapshot.empty);
  };

  useEffect(() => {
    checkInCart();
    checkInOrders();
  }, []);

  const addToCart = async () => {
    try {
      await addDoc(collection(db, "cart"), {
        name: editedProduct.name,
        category: editedProduct.category,
        price: Number(editedProduct.price),
        images: editedProduct.images,
        createdAt: serverTimestamp(),
        pid: product.pid,
        brand:editedProduct.brand,
      });
      setInCart(true);
      navigation.navigate("MainTabs", { screen: "Cart" });
    } catch (e) {
      console.log(e);
      Alert.alert("Error adding to cart");
    }
  };

  const handleAddToCart = () => {
    Alert.alert(
      "Add to Cart",
      "Are you sure, you want to add product to cart",
      [
        { text: "Add", onPress: addToCart },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const addToOrders = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        name: editedProduct.name,
        category: editedProduct.category,
        price: Number(editedProduct.price),
        images: editedProduct.images,
        createdAt: serverTimestamp(),
        pid: product.pid,
        quantity:1,
        brand:editedProduct.brand,
      });
      setInOrders(true);
      navigation.navigate("MainTabs", { screen: "My Orders" });
    } catch (e) {
      console.log(e);
      Alert.alert("Error adding to cart");
    }
  };

  const handleAddToOrders = () => {
    Alert.alert(
      "Buy",
      "Are you sure, you want to buy this product ",
      [
        { text: "Buy", onPress: addToOrders },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Edit", {
              product: editedProduct,
              onSave: (updatedProduct) => setEditedProduct(updatedProduct),
            })
          }
        >
          <Ionicons name="pencil" size={25} />
        </TouchableOpacity>
      </View>
      {/* <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        style={{ flexGrow: 0 }}
      >
        {editedProduct.images.map((image, index) => {
          return (
            <Image
              key={index}
              source={{ uri: `data:image/jpeg;base64,${image}` }}
              style={styles.coverimage}
            />
          );
        })}
      </ScrollView> */}
      <ImageCarousel images={editedProduct.images} />
      <Text style={styles.text}>Name: {editedProduct.name}</Text>
      <Text style={styles.text}>ID: {product.pid}</Text>
      <Text style={styles.text}>Category: {editedProduct.category}</Text>
      <Text style={styles.text}>Price: ₹{editedProduct.price}</Text>
      <Text style={styles.text}>Brand: {editedProduct.brand}</Text>
      <View style={{flexDirection:"row", position: "absolute",bottom: 20,right: 10,left: 10,}}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: !inCart ? "#0c6977ff" : "#e1eb34" },
        ]}
        onPress={
          !inCart
            ? handleAddToCart
            : () => navigation.navigate("MainTabs", { screen: "Cart" })
        }
      >
        <Text style={{ color: !inCart ? "#fff" : "#000" }}>
          {!inCart ? "Add to Cart" : "Go to Cart"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: !inOrders ? "#e1eb34" : "#0c6977ff" },
        ]}
        onPress={
          !inOrders
            ? handleAddToOrders
            : () => navigation.navigate("MainTabs", { screen: "My Orders" })
        }
      >
        <Text style={{ color: !inOrders ? "#000" : "#fff" }}>
          {!inOrders ? "Buy" : "Go to Orders"}
        </Text>
      </TouchableOpacity>
      </View>
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
  coverimage: { width: 380, height: 300, resizeMode: "stretch" },
  text: { fontSize: 18 },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    flex:1,
  },
});
