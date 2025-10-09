import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
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

export const Orders = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        ...doc.data(),
        opid: doc.id,
      }));
      setOrders(list);
    });
    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.images[0]}` }}
        style={styles.image}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.text}>Name:{item.name}</Text>
        <Text style={styles.text}>Price:₹{item.price*item.quantity}</Text>
        <Text style={styles.text}>ProductId:{item.opid}</Text>
        <Text style={styles.text}>Category:{item.category}</Text>
        <Text style={styles.text}>Quantity:{item.quantity}</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(i) => i.opid}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 10, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          orders.length === 0 && (
            <View style={styles.ListEmptyComponent}>
              <Text>No orders found</Text>
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
    width: 110,
    height: 135,
    borderRadius: 6,
    marginLeft: 10,
    resizeMode: "stretch",
  },
  text: { fontSize: 18 },
  title: { fontSize: 35, marginLeft: 75, marginRight: 40 },
  ListEmptyComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
