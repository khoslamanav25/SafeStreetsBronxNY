import React, {useState} from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, TextInput, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';

import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'


import defaultImage from '../assets/placeholder.png'; // Adjust the path to your default image



const ReportScreen = ({ navigation }) => {
  
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState(null);

  const selectImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

  
    console.log(result.assets[0].uri)
    if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
  };

  const uploadReport = async () => {

    //CONVERTING IMAGE TO BLOB FOR FIREBASE STORAGE
    const image_response = await fetch(image);
    const image_blob = await image_response.blob();

    try {

        //WRITING IMAGE TO FIREBASE STORAGE (NOT FIRESTORE) WITH IDENTIFIER

        const firebasefileLocation = "reportImages/" + FIREBASE_AUTH.currentUser.uid + "/" + new Date()
        console.log(firebasefileLocation)
        const storageRef = ref(storage, firebasefileLocation);

        const uploadTask = uploadBytesResumable(storageRef, image_blob);

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes)
            //console.log("Progress of image upload: " + progress * 100 + "%")
        }, 
        (error) => {
            console.log(error)
        }, //On Error
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(getDownloadURL) => {
              setImage("")
              setLocation("")
              setDescription("")
              navigation.navigate('Map')
            })
        } //On Completion
        )  

        //WRITING TO FIRESTORE
        const report = {
            image: firebasefileLocation,
            location: location,
            description: description,
            user: FIREBASE_AUTH.currentUser.uid,
            time: new Date()
        }

        res = await setDoc(doc(db, "reports", Date()), report);
        console.log("Succesfully Wrote Report To Firebase")
      

      } catch (error) {
        console.error('Error writing document:', error);
      }
  }


  return (
    <View style={styles.safeArea}>
      <ScrollView>
      <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Report the Incident</Text>
      </View>

      <View style={styles.separator} />

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Location / Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location / address"
              placeholderTextColor="#16247d"
              onChangeText={setLocation}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter description - Or... Generate automatically "
              placeholderTextColor="#16247d"
              multiline={true}
              numberOfLines={4}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Upload Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            {<Image source={image ? { uri: image } : defaultImage} style={styles.image}/>}
          </TouchableOpacity>

          </View>

          
          <TouchableOpacity style={styles.uploadReport} onPress={uploadReport}>
            <Text style={styles.uploadReportText}>Upload Report</Text>
          </TouchableOpacity>

          



        </View>
      </View>
      </ScrollView>
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
    paddingTop: 30,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16247d",
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
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    borderRadius: 3,
    height: 250,
    width: 250,
    borderWidth: 3,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Light grey color for the separator
    width: "100%",
    marginBottom: 20,
  },
  uploadReport: {
    backgroundColor: "blue",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  uploadReportText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReportScreen;
