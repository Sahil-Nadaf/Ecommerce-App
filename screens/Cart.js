import Checkbox from "expo-checkbox";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
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
import { db } from "../firestore/firebaseConfig";

export const Cart = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsForBuy, setSelecteditemsForBuy]=useState([])

  useEffect(() => {
    const q = query(collection(db, "cart"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        ...doc.data(),
        cpid: doc.id,
        quantity: 1,
      }));
      setCart(list);
    });

    return () => unsub();
  }, []);

  const toggleSelect = (cpid) => {
    setSelectedItems((prev) =>
      prev.includes(cpid) ? prev.filter((i) => i !== cpid) : [...prev, cpid]
    );
  };

  const toggleSelectForBuy=(item)=>{
    setSelecteditemsForBuy((prev)=>prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item])
  }

  const increaseQuantity = (cpid) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cpid === cpid ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (cpid) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cpid === cpid && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteSelected = async () => {
    try {
      for (let cpid of selectedItems) {
        await deleteDoc(doc(db, "cart", cpid));
      }
      setSelectedItems([]);
      setSelecteditemsForBuy([])
    } catch (err) {
      console.error("Error deleting selected items: ", err);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;

    Alert.alert(
      "Remove Selected Products",
      "Are you sure you want to remove selected products from cart?",
      [
        {
          text: "Remove",
          onPress: deleteSelected,
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };


   const buySelected = async () => {
    try {
      for (let item of selectedItemsForBuy) {

      const q = query(collection(db, "orders"), where("pid", "==", item.pid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        await deleteDoc(doc(db, "cart", item.cpid));
        continue;
      }

        await addDoc(collection(db, "orders"),{
          name:item.name,
          category:item.category,
          price:item.price,
          images:item.images,
          createdAt:serverTimestamp(),
          pid:item.pid,
          quantity:item.quantity,
        });
        await deleteDoc((doc(db,"cart",item.cpid)))
      }
      setSelectedItems([]);
      setSelecteditemsForBuy([])
      navigation.navigate("MainTabs", { screen: "My Orders" });
    } catch (err) {
      console.error("Error deleting selected items: ", err);
    }
  };

  const handleBuySelected = () => {
    if (selectedItemsForBuy.length === 0) return;

    Alert.alert(
      "Buy Selected Products",
      "Are you sure you want to buy selected products from cart?",
      [
        {
          text: "Buy",
          onPress: buySelected,
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.images[0]}` }}
        style={styles.image}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.text}>Name:{item.name}</Text>
        <Text style={styles.text}>Price:₹{item.price*item.quantity}</Text>
        <Text style={styles.text}>ProductId:{item.pid}</Text>
        <Text style={styles.text}>Category:₹{item.category}</Text>
        <Text style={styles.text}>Quantity:{item.quantity}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.cpid)}>
            <Ionicons name="remove-circle-outline" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => increaseQuantity(item.cpid)}>
            <Ionicons name="add-circle-outline" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <Checkbox
        value={selectedItems.includes(item.cpid)}
        onValueChange={() =>{ 
          toggleSelect(item.cpid)
          toggleSelectForBuy(item)
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Cart</Text>
        {selectedItems.length > 0 && (
          <View style={{flexDirection:"row",gap:20}}>
          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={{ alignItems: "center" }}
          >
            <Ionicons name="trash-outline" size={30} />
            <Text>Remove</Text>
          </TouchableOpacity><TouchableOpacity
            onPress={handleBuySelected}
            style={{ alignItems: "center" }}
          >
            <Ionicons name="bag-outline" size={30} />
            <Text>Buy</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={cart}
        keyExtractor={(i) => i.cpid}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 10, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          cart.length === 0 && (
            <View style={styles.ListEmptyComponent}>
              <Text>Your Cart is empty</Text>
            </View>
          )
        }
      />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 6,
    marginLeft: 10,
    resizeMode: "stretch",
  },
  title: { fontSize: 35, marginLeft: 110, marginRight: 40 },
  ListEmptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 18 },
});
