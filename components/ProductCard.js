import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

export const ProductCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.bookcard} onPress={onPress}>
      <Image
        source={{uri:`data:image/jpeg;base64,${item.images[0]}`}}
        style={styles.bookimage}
      />
      <Text style={[styles.booktext, { fontWeight: "bold" }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.booktext} numberOfLines={1}>
        ₹{item.price}
      </Text>
      <Text style={styles.booktext} numberOfLines={1}>
        {item.brand}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookcard: {
    flex: 1,
    backgroundColor: "#ffff",
    aspectRatio: 0.85,
    borderRadius: 15,
    padding: 10,
  },
  bookimage: {
    flex: 1,
    width: "100%",
    resizeMode: "stretch",
    borderRadius: 10,
  },
  booktext: {
    textAlign: "center",
  },
});
