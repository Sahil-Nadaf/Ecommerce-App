import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ProductCard } from "../components/ProductCard";
import { db } from "../firestore/firebaseConfig";

export const Home = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);

  const categories = [
    "All",
    "Fashion",
    "Mobile",
    "Electronics",
    "Appliances",
    "Beauty and Personal care",
    "Sports",
    "Home",
    "Smart Gadgets",
  ];

  const prices = [
    "100-200",
    "201-400",
    "401-600",
    "601-800",
    "801-1000",
    "1001 and above",
    "99 and below",
  ];

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    categories.map((cat) => ({ key: cat.toLowerCase(), title: cat }))
  );

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
    let filteredData = [...products];

    if (selectedCategory && debouncedSearch.trim() === "" && !selectedPrice) {
      filteredData = products.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      console.log("cat", selectedCategory);
    } else if (
      !selectedCategory &&
      debouncedSearch.trim() !== "" &&
      !selectedPrice
    ) {
      filteredData = products.filter((item) =>
        item.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      console.log("name");
    } else if (
      !selectedCategory &&
      debouncedSearch.trim() !== "" &&
      selectedPrice
    ) {
      filteredData = products
        .filter((item) =>
          item.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .filter((item) => {
          const price = Number(item.price);
          if (selectedPrice === "1001 and above") return price >= 1001;
          if (selectedPrice === "99 and below") return price <= 99;
          const [min, max] = selectedPrice.split("-").map(Number);
          return price >= min && price <= max;
        });
      console.log("name+price");
    } else if (
      selectedCategory &&
      debouncedSearch.trim() !== "" &&
      !selectedPrice
    ) {
      filteredData = products.filter(
        (item) =>
          item.category
            .toLowerCase()
            .includes(selectedCategory.toLowerCase()) &&
          item.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      console.log("cat+name");
    } else if (
      selectedCategory &&
      debouncedSearch.trim() !== "" &&
      selectedPrice
    ) {
      filteredData = products
        .filter(
          (item) =>
            item.category
              ?.toLowerCase()
              .includes(selectedCategory.toLowerCase()) &&
            item.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .filter((item) => {
          const price = Number(item.price);
          if (selectedPrice === "1001 and above") return price >= 1001;
          if (selectedPrice === "99 and below") return price <= 99;
          const [min, max] = selectedPrice.split("-").map(Number);
          return price >= min && price <= max;
        });
      console.log("cat+name+price");
    } else {
      filteredData = products;
      console.log("All");
    }

    setFilteredProducts(filteredData);
  }, [debouncedSearch, products, selectedCategory, selectedPrice]);

  useEffect(() => {
    const newCategory = categories[index];
    setSelectedCategory(newCategory === "All" ? "" : newCategory);
  }, [index]);

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
        {debouncedSearch.trim() !== "" && (
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="options-outline" size={28} color="black" />
          </TouchableOpacity>
        )}
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

      <View style={{ height: 50 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={() => null}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{ backgroundColor: "#000" }}
              style={{ backgroundColor: "#b8d4c3ff" }}
              activeColor="#961313ff"
              inactiveColor="#1e2b9c"
            />
          )}
        />
      </View>

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
            <Text style={styles.modalHeader}>
              {/* {debouncedSearch.trim() !== ""
                ? "Filter by Price"
                : "Filter by Category"} */}
              Filter by Price
            </Text>
            {/* {debouncedSearch.trim() === "" && !selectedCategory && (
              <>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category && {
                        backgroundColor: "#b8d4c3ff",
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setFilterVisible(false);
                    }}
                  >
                    <Text>{category}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )} */}
            {/* {debouncedSearch.trim() !== "" && ( */}
            <>
              {prices.map((price) => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.categoryItem,
                    selectedPrice === price && {
                      backgroundColor: "#b8d4c3ff",
                    },
                  ]}
                  onPress={() => {
                    setSelectedPrice(price);
                    setFilterVisible(false);
                  }}
                >
                  <Text>₹ {price}</Text>
                </TouchableOpacity>
              ))}
            </>
            {/* )} */}
            {/* {debouncedSearch.trim() === "" && selectedCategory && (
              <>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryItem,
                      selectedCategory === category && {
                        backgroundColor: "#b8d4c3ff",
                      },
                    ]}
                    onPress={() => {
                      setSelectedCategory(category);
                      setFilterVisible(false);
                    }}
                  >
                    <Text>{category}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )} */}
            <TouchableOpacity
              style={[styles.categoryItem, { backgroundColor: "#eee" }]}
              onPress={() => {
                // setSelectedCategory("");
                setSelectedPrice("");
                setFilterVisible(false);
              }}
            >
              <Text>Clear Filter</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  ListEmptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
