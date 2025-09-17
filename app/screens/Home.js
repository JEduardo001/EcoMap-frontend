import React, {useState} from "react"
import { StyleSheet, View,Image,TouchableOpacity,Text} from "react-native"
import MapView, { Marker, Callout } from "react-native-maps"
import {image} from "../../assets/markerPinkMedium.png"
import { MaterialIcons } from '@expo/vector-icons';
import {animals} from "../constants/Animals.js"
/* que es IA aplicada + cloud */
export const Home = () => {
  const [sizeMarker, setSizeMarker] = useState()
  const [visibleContainerSelectInfo,setVisibleContainerSelectInfo] = useState(false)
  const region = {
    latitude: 24.1314817,
    longitude: -110.3250219,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r) => {setSizeMarker(r.longitudeDelta)}} 
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        zoomControlEnabled
        mapType="satellite"
      >

       {
        animals.map((animal) => {
          return (
            <Marker
              key={animal.name}
              coordinate={animal.coordinate}
              title={animal.name}
              description={animal.description}
              //image={getMarkerImage(animal)}
            >
              <Image 
                source={{ uri: animal.image }}
                style={{width: 80, height: 80}}
                resizeMode="contain"
              />
              <Callout tooltip>
                <View style={[styles.callout, { width: 150 }]}>
                  <Text style={styles.calloutText}>{animal.name}</Text>
                  <Text style={styles.calloutText}>{animal.description}</Text>

                  <TouchableOpacity
                    onPress={() => setVisibleContainerSelectInfo(!visibleContainerSelectInfo)}
                  >
                    <MaterialIcons name="edit" size={30} color="black" />
                  </TouchableOpacity>

                </View>
              </Callout>
            </Marker>
          )
        })
       }
          
      </MapView>

      <TouchableOpacity
        style={styles.btnSelectInfo}
        onPress={() => setVisibleContainerSelectInfo(!visibleContainerSelectInfo)}
      >
        <MaterialIcons name="edit" size={30} color="black" />
      </TouchableOpacity>

      {
        visibleContainerSelectInfo
        ?
          <View style={styles.containerChangeInfo}>
            <Text style={styles.containerChangeInfoText}>Editar Información</Text>
            <TouchableOpacity style={styles.containerSectionInfo}>
              <MaterialIcons name="edit" size={30} color="#ffd700" />
              <Text style={styles.sectionText}>Mostrar Fauna</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerSectionInfo}>
              <MaterialIcons name="edit" size={30} color="#00ff99" />
              <Text style={styles.sectionText}>Mostrar Flora</Text>
            </TouchableOpacity>
          </View>
        : null
      }
    

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: {
    width: "90%",
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    elevation: 2,
  },
  calloutText: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  btnSelectInfo: {
    position: "absolute",
    top: '10%',
    left: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
 
  containerChangeInfo: {
      width: '70%',
      position: "absolute",
      top: '20%',
      left: 20,
      right: 20,
      backgroundColor: "#1e1e2f",
      borderRadius: 20,
      padding: 20,
      elevation: 10,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 10 },
    },
    containerChangeInfoText: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 15,
      textAlign: "center",
    },
    containerSectionInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#2b2b3f",
      padding: 15,
      borderRadius: 15,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOpacity: 0.4,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
    },
    sectionText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#f0f0f0",
    }
});

