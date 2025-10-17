import React, { useState,useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text, Modal } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';
import { animals } from "../constants/Animals.js";
import {fetchMarkers,fetchMarkersByFilter} from "../services/api/index.js"
import { filters } from "../constants/Filters.js";

export const Home = () => {
  const [sizeMarker, setSizeMarker] = useState(0.1);
  const [visibleContainerSelectInfo, setVisibleContainerSelectInfo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [markers,setMarkers] = useState([])
  const [filter,setFilter] = useState(null)

  useEffect(() => {
    getMarkers()
  },[])

  useEffect(() => {
    getMarkersByFilter(filter)
  },[filter])

  const getMarkersByFilter = async () => {
    if(!filter){
      getMarkers()
      return
    }
    const response = await fetchMarkersByFilter(filter)
    if(response.status != 200){
      console.error("Error fetching markers by filter")
    }
    console.log("Markers fetched by filter:", response)
    setMarkers(response.data)
  }

  const getMarkers = async () => {
    const response = await fetchMarkers()
    if(response.status != 200){
      console.error("Error fetching markers")
    }
    setMarkers(response.data)
  }


  const handleMarkerPress = (animal) => {
    setSelectedAnimal(animal);
    setModalVisible(true);
  };

  const region = {
    latitude: 24.1314817,
    longitude: -110.3250219,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(r) => setSizeMarker(r.longitudeDelta  )}
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        zoomControlEnabled
        mapType="satellite"
      >
        {markers.map((marker) => (
          <Marker
            key={marker.animal.name}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker.animal)}
            image={require('../../assets/ballenaJorobada.png')}
            style={{backgroundColor: 'red', width: 700, height: 700, padding: 0, margin: 0}}
          >
            
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.btnSelectInfo}
        onPress={() => setVisibleContainerSelectInfo(!visibleContainerSelectInfo)}
      >
        <MaterialIcons name="edit" size={30} color="black" />
      </TouchableOpacity>

      {visibleContainerSelectInfo && (
        <View style={styles.containerChangeInfo}>
          <Text style={styles.containerChangeInfoText}>Editar Información</Text>
          <TouchableOpacity style={styles.containerSectionInfo} onPress={() => setFilter(null)} >
                  <MaterialIcons name="edit" size={30} color="#ffd700" />
                  <Text style={styles.sectionText}>Quitar Filtros</Text>
          </TouchableOpacity>
          {
            filters.map((filter) => {
              return (
                <TouchableOpacity style={styles.containerSectionInfo} onPress={() => setFilter(filter.id)} key={filter.id} >
                  <MaterialIcons name="edit" size={30} color="#ffd700" />
                  <Text style={styles.sectionText}>Mostrar {filter.name}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAnimal?.name || 'Animal'}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/ballenaJorobada.png')}
                style={styles.animalImage}
                resizeMode="stretch"
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.animalDescription}>
                {selectedAnimal?.description || 'Descripción no disponible'}
              </Text>
              <View style={styles.coordinatesContainer}>
                <View style={styles.coordinateItem}>
                  <MaterialIcons name="my-location" size={18} color="#4CAF50" />
                  <Text style={styles.coordinateText}>
                    Latitud: {selectedAnimal?.coordinate?.latitude?.toFixed(4) || 'N/A'}
                  </Text>
                </View>
                <View style={styles.coordinateItem}>
                  <MaterialIcons name="my-location" size={18} color="#4CAF50" />
                  <Text style={styles.coordinateText}>
                    Longitud: {selectedAnimal?.coordinate?.longitude?.toFixed(4) || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '85%',
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeBtn: { padding: 5 },
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'red',
  },
  animalImage: {
    width: 350,
    height: 350,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'blue',
  },
  infoContainer: { padding: 20 },
  animalDescription: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  coordinatesContainer: { backgroundColor: '#f0f8f0', borderRadius: 10, padding: 15 },
  coordinateItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  coordinateText: { marginLeft: 10, fontSize: 14, color: '#555' },
});
