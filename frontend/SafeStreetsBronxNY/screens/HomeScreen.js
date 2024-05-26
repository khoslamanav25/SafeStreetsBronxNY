import React from "react";
import { SafeAreaView, StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { Icon } from "react-native-elements";

const HomeScreen = ({ navigation }) => {

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.replace("Login"); // Ensure navigation back to login
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <MenuProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Menu style={styles.menuStyles}>
            <MenuTrigger>
              <Icon
                name={"dots-three-vertical"}
                type={"entypo"}
                size={20}
                color="black" // Color of the icon
              />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={handleSignOut} text="Sign Out" />
            </MenuOptions>
          </Menu>
        </View>
      </SafeAreaView>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  menuStyles: {
    flexDirection: "row",
    justifyContent: "flex-end", // This aligns items to the right
    margin: 20,
  } 
});

export default HomeScreen;
