import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { Icon } from "react-native-elements";
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import Papa from 'papaparse';
import { Picker } from '@react-native-picker/picker'

import { doc, getDoc, onSnapshot} from 'firebase/firestore'

const HomeScreen = ({ navigation }) => {
  const [crimeWtd, setCrimeWtd] = useState([]);
  const [crime28d, setCrime28d] = useState([]);
  const [crimeYtd, setCrimeYtd] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [heatMapRadius, setHeatMapRadius] = useState(25)

  const [markerCoords, setMarkerCoords] = useState([])

  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.replace("Login"); // Ensure navigation back to login
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const crime_wtd = `
  Brooklyn North,Bronx,Manhattan South,Queens North,Queens South,Staten Island
  2373,2373,529,300,202,68
  `;

  const crime_28d = `
  Brooklyn North,Bronx,Manhattan South,Queens North,Queens South,Staten Island
  9586,9586,2315,1232,825,280
  `;

  const crime_ytd = `
  Brooklyn North,Bronx,Manhattan South,Queens North,Queens South,Staten Island
  43714,43714,10262,5693,3701,1311
  `;

  const parseCrimeString = (content, setCrimeData) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const valuesArray = [];
        result.data.forEach((d) => {
          valuesArray.push(Object.values(d));
        });
        setCrimeData(valuesArray);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      },
    });
  };

  const fetchCurrentData = async () => {
    try{
        const initialData = await db.collection("reports").get()
        console.log(initialData)
    } catch (error) {
        console.log("Error: " + error)
    }
  }

  useEffect(() => {
    parseCrimeString(crime_wtd, setCrimeWtd);
    parseCrimeString(crime_28d, setCrime28d);
    parseCrimeString(crime_ytd, setCrimeYtd);

    //fetchCurrentData();
  }, []);

  useEffect(() => {
    if (crimeWtd.length > 0) {
      setSelectedTime(crimeWtd);
    }
  }, [crimeWtd]);

  useEffect(() => {
    if (selectedTime.length > 0 && selectedTime[0].length > 0) {
      var total = 0;
      for (var i = 0; i < selectedTime[0].length; i++) {
        total += parseInt(selectedTime[0][i].trim(), 10);
      }

      var weights = [];
      for (var i = 0; i < selectedTime[0].length; i++) {
        weights.push((1 - parseInt(selectedTime[0][i].trim(), 10) / total));
      }
      setSelectedWeights(weights);

      if(selectedTime == crimeWtd){
        setHeatMapRadius(25)
      } else if(selectedTime == crime28d){
        setHeatMapRadius(50)
      } else {
        setHeatMapRadius(100)
      }
    }
  }, [selectedTime]);

  const initialRegion = {
    latitude: 40.7194,
    longitude: -73.9232,
    latitudeDelta: 0.258,
    longitudeDelta: 0.3539,
  };

  const points = [
    { latitude: 40.6943, longitude: -73.9167, weight: selectedWeights[0] }, // Brooklyn North
    { latitude: 40.8370, longitude: -73.8654, weight: selectedWeights[1] }, // Bronx
    { latitude: 40.7767, longitude: -73.9713, weight: selectedWeights[2] }, // Manhattan South
    { latitude: 40.7498, longitude: -73.7976, weight: selectedWeights[3] }, // Queens North
    { latitude: 40.6794, longitude: -73.8365, weight: selectedWeights[4] }, // Queens South
    { latitude: 40.5790, longitude: -74.1515, weight: selectedWeights[5] }  // Staten Island
  ];

  const handleValueChange = (value) => {
    switch (value) {
      case 'wtd':
        setSelectedTime(crimeWtd);
        break;
      case '28d':
        setSelectedTime(crime28d);
        break;
      case 'ytd':
        setSelectedTime(crimeYtd);
        break;
      default:
        break;
    }
  };

  return (
    <MenuProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Picker
            style={styles.picker}
            onValueChange={(selectedValue) => handleValueChange(selectedValue)}
          >
            <Picker.Item label="Week to Date" value="wtd" />
            <Picker.Item label="Past Month" value="28d" />
            <Picker.Item label="Year to Date" value="ytd" />
          </Picker>
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
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
          >
            <Heatmap
              points={points}
              radius={heatMapRadius}
            />
          </MapView>
        </View>
      </SafeAreaView>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff', // Add background color to header
    zIndex: 1, // Ensure the header stays above the map
  },
  menuStyles: {
    flexDirection: "row",
    justifyContent: "flex-end", // This aligns items to the right
  },
  mapContainer: {
    flex: 1, // Take the remaining space after the header
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff', // Add background color to footer
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default HomeScreen;
