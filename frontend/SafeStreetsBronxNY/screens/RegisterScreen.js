import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
  } from "react-native";
  import React, { useState } from "react";
  import PhoneInput from "react-native-phone-number-input";
  import { TextInput } from "react-native-paper";
  import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
  import {
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore";
  
  const RegisterScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneInput, setPhoneInput] = useState(null);
    const [email, setEmail] = useState("");
  
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleShowConfirmPassword = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };
  
    const auth = FIREBASE_AUTH;
    const db = FIRESTORE_DB;
  
    const register = async () => {
      if (
        phoneNumber === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
        alert("Please fill out all the fields!");
      } else if (!phoneInput?.isValidNumber(phoneNumber)) {
        alert("Error: Invalid Phone Number");
      } else if (password !== confirmPassword) {
        alert("Error: Passwords Do Not Match");
      } else {
        try {
          await createUserWithEmailAndPassword(auth, email, password).then(
            (newUser) => {
              const user = newUser.user;
              setDoc(doc(db, "Users", user.uid), {
                Email: user.email,
                PhoneNumber: phoneNumber,
                UserID: user.uid,
              });
            }
          );
        } catch (error) {
          alert(error);
          console.log("Error: " + error);
        }
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.registerText}>Register</Text>
        <View style={styles.inputContainer}>
          <PhoneInput
            ref={(input) => setPhoneInput(input)}
            defaultCode="US"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeFormattedText={(text) => setPhoneNumber(text)}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputTextContainer}
            textInputStyle={styles.phoneInputText}
          />
          <TextInput
            placeholder="Email"
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.textInput}
            placeholderTextColor="#aaa"
            theme={{ colors: { primary: "#000" } }}
          />
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.textInput}
            placeholder="Password"
            textContentType="oneTimeCode"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
            right={
              <TextInput.Icon
                icon={showPassword ? "eye" : "eye-off"}
                color="#C4C4C4"
                onPress={toggleShowPassword}
              />
            }
            theme={{ colors: { primary: "#000" } }}
          />
          <TextInput
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.textInput}
            placeholder="Confirm Password"
            autoCapitalize="none"
            textContentType="oneTimeCode"
            placeholderTextColor="#aaa"
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye" : "eye-off"}
                color="#C4C4C4"
                onPress={toggleShowConfirmPassword}
              />
            }
            theme={{ colors: { primary: "#000" } }}
          />
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => register()}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.linkText}>Have an Account? Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#E9F2EF",
      justifyContent: "center",
      alignItems: "center",
    },
    logoContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: 300,
      height: 300,
      resizeMode: "contain",
      margin: -30,
    },
    registerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 16,
    },
    inputContainer: {
      width: "90%",
      marginBottom: 24,
      alignItems: "center",
    },
    phoneInputContainer: {
      width: "100%",
      borderRadius: 8,
      backgroundColor: "#FFF",
      borderColor: "#ccc",
      borderWidth: 1,
      marginBottom: 16,
    },
    phoneInputTextContainer: {
      borderRadius: 8,
      backgroundColor: "#FFF",
      borderColor: "#E9F2EF",
      paddingLeft: 4,
    },
    phoneInputText: {
      color: "#333",
    },
    textInput: {
      width: "100%",
      borderRadius: 8,
      backgroundColor: "#FFF",
      marginBottom: 16,
      color: "#333",
    },
    eyeIcon: {
      marginLeft: 10,
    },
    registerButton: {
      width: "90%",
      backgroundColor: "#8FB8A4",
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 16,
    },
    registerButtonText: {
      color: "#FFF",
      fontWeight: "bold",
    },
    loginLink: {
      alignItems: "center",
      marginBottom: 16,
    },
    linkText: {
      color: "#2A9D8F",
      textDecorationLine: "underline",
    },
  });
  
  export default RegisterScreen;
  