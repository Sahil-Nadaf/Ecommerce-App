import { StyleSheet, Text, TextInput, View } from "react-native";

export const UserInput =({label,placeholder, value, onChangeText, keyboardType}) => {

return <View>
        <Text>{label}</Text>
        <TextInput
            placeholder={placeholder}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
        />
    </View>
}


const styles=StyleSheet.create({
  input:{
    borderColor: "black",
    borderWidth: 0.5,
    borderRadius: 5,
    padding: 8,
  }
})