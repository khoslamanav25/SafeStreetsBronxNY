import React, {useState} from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, TextInput } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Icon } from "react-native-elements";


const ReportScreen = ({ navigation }) => {

  const [image, setImage] = useState(null);

  const selectImage = async () => {

    console.log("SDFSDF ")
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {}}>
            <Icon
              name="dots-three-vertical"
              type="entypo"
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Location / Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location / address"
              placeholderTextColor="#16247d"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter description"
              placeholderTextColor="#16247d"
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.uploadButtonText}>Upload Photo</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#16247d",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#16247d",
    borderRadius: 5,
    padding: 10,
  },
  descriptionInput: {
    height: 120,
  },
  uploadButton: {
    backgroundColor: "#16247d",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 5,
  }
});

export default ReportScreen;
