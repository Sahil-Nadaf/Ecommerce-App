// import * as ImagePicker from "expo-image-picker";
// import { useState } from "react";
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// export const Practice = () => {
// const [images, setImages] = useState([]);
// const pickFromGallery = async ()=>{
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsMultipleSelection: true, 
//       selectionLimit: 0, 
//       mediaTypes: ['images'],
//       quality:1,
//        aspect: [4, 3],
//     });

//     if (!result.canceled) {
//       setImages(result.assets); 
//     }
// }


//   return (
//     <View style={styles.container}>
//       <Text>practice</Text>
//       <TouchableOpacity style={styles.btn} onPress={pickFromGallery}>
//         <Text>Pick Image</Text>
        
//       </TouchableOpacity>
//       <ScrollView>
// {images.map((img, index) => (
//           <Image
//             key={index}
//             source={{ uri: img.uri }}
//             style={{ width: 100, height: 100, margin: 5 }}
//           />
//         ))}
//         </ScrollView>
//     </View>
//   )
// }

 

// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         padding:10
//     },
//     btn:{
//         alignItems:"center",
//         justifyContent:"center",
//         borderWidth:2
//     }
// })











import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Authors } from "../components/Authors";
import { Categories } from "../components/Categories";
import { Description } from "../components/Description";
import { SaleInfo } from "../components/SaleInfo";
import { VolumeInfo } from "../components/VolumeInfo";

export const BookDetails = ({ navigation, route }) => {
  const book = route.params?.book;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "volumeinfo", title: "VolumeInfo" },
    { key: "saleinfo", title: "SaleInfo" },
    { key: "authors", title: "Authors" },
    { key: "categories", title: "Categories" },
    { key: "description", title: "Description" },
  ]);

  const renderScene = SceneMap({
    volumeinfo: () => <VolumeInfo book={book} />,
    saleinfo: () => <SaleInfo book={book} />,
    authors: () => <Authors book={book} />,
    categories: () => <Categories book={book} />,
    description: () => <Description book={book} />,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#000" }}
      style={{ backgroundColor: "#fff" }}
      activeColor="#309b79ff"
      inactiveColor="#A6A6A6"
      scrollEnabled
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Details</Text>
      </View>
      <Image
        source={{
          uri:
            book.volumeInfo?.imageLinks?.thumbnail ??
            "https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvam9iNjgyLTI0NS1wLnBuZw.png",
        }}
        style={styles.coverimage}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        initialLayout={{ width: layout.width }}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        lazy
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
  header: { flexDirection: "row", alignItems: "center", width: "100%" },
  title: { fontSize: 35, flex: 1, textAlign: "center" },
  coverimage: { width: "100%", aspectRatio: 1.5, resizeMode:"stretch" },
});





export const AddCategories = ({ categories, setCategories }) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const categoryOptions = [
    "Comics & Graphic Novels",
    "Fiction",
    "Literary Criticism",
    "Art",
    "Biography & Autobiography",
    "Poetry",
    "Business & Economics",
  ];
  return (
    <View style={styles.addcontainer}>
      <Text style={styles.header}>Categories</Text>
      {/* <UserInput
        label="Categories"
        placeholder="Enter categories (e.g. Fiction, Science)"
        value={categories}
        onChangeText={setCategories}
      /> */}
      {categories.length === 0 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={{ color: "#fff" }}>Select Categories</Text>
        </TouchableOpacity>
      ) : (
        <View>
          {categories.map((category) => {
            return <Text>{category}</Text>;
          })}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Select Categories</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={categoryModalVisible}
        transparent
        onRequestClose={() => setCategoryModalVisible(false)}
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Category</Text>
            {categoryOptions.map((category) => {
              const isSelected = categories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    isSelected && { backgroundColor: "#b8d4c3ff" },
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      setCategories(categories.filter((c) => c !== category));
                    } else {
                      setCategories([...categories, category]);
                    }
                  }}
                >
                  <Text>{category}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.categoryItem, { backgroundColor: "#eee" }]}
              onPress={() => setCategories([])}
            >
              <Text>Clear Selection</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};