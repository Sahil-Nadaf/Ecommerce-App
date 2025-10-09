import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ProductCard } from "../components/ProductCard";
import { db } from "../firestore/firebaseConfig";

export const Home = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ ...d.data(), pid: d.id }));
      setProducts(list);
      setFilteredProducts(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setFilteredProducts(products);
    } else {
      const newData = products.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(newData);
    }
  }, [debouncedSearch, products]);

  const renderItem = ({ item }) =>
    item.empty ? (
      <View style={{ flex: 1 }} />
    ) : (
      <ProductCard
        item={item}
        onPress={() => navigation.navigate("Details", { product: item })}
      />
    );

  const dataWithPadding =
    filteredProducts.length % (height > width ? 2 : 3) === 0
      ? filteredProducts
      : [...filteredProducts, { empty: true }];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.header}>Shoply</Text>
      <View style={styles.searchbar}>
        <Ionicons name="search-outline" color="#000" size={25} />
        <TextInput
          placeholder="Search product by name..."
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* <ActivityIndicator size="small" color="gray" /> */}
      </View>
      {/* <View style={styles.box}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="add-outline" size={40} />
          <Text>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cart")}
          style={{ alignItems: "center" }}
        >
          <Ionicons name="cart-outline" size={40} />
          <Text>Cart</Text>
        </TouchableOpacity>
      </View> */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={dataWithPadding}
          key={height > width ? "portrait" : "landscape"}
          numColumns={height > width ? 2 : 3}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.pid || index.toString()}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
          ListEmptyComponent={
            filteredProducts.length === 0 && (
              <View style={styles.ListEmptyComponent}>
                <Text>No products found</Text>
              </View>
            )
          }
        />
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
  header: { fontSize: 35, textAlign: "center" },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  input: { flex: 1 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  contentContainerStyle: { gap: 10, width: "100%", flexGrow: 1 },
  ListEmptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
