import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export const Practice = () => {
const [images, setImages] = useState([]);
const pickFromGallery = async ()=>{
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true, 
      selectionLimit: 0, 
      mediaTypes: ['images'],
      quality:1,
       aspect: [4, 3],
    });

    if (!result.canceled) {
      setImages(result.assets); 
    }
}


  return (
    <View style={styles.container}>
      <Text>practice</Text>
      <TouchableOpacity style={styles.btn} onPress={pickFromGallery}>
        <Text>Pick Image</Text>
        
      </TouchableOpacity>
      <ScrollView>
{images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img.uri }}
            style={{ width: 100, height: 100, margin: 5 }}
          />
        ))}
        </ScrollView>
    </View>
  )
}

 

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    btn:{
        alignItems:"center",
        justifyContent:"center",
        borderWidth:2
    }
})