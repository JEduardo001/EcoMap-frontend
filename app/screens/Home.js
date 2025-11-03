import React, { useState,useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity,ScrollView, Text, Modal } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';
import { animals } from "../constants/Animals.js";
import {fetchMarkers,fetchMarkersByFilter} from "../services/api/index.js"
import { filters } from "../constants/Filters.js";
import { useNavigation } from '@react-navigation/native';

export const Home = () => {
  const [sizeMarker, setSizeMarker] = useState(0.1);
  const [visibleContainerSelectInfo, setVisibleContainerSelectInfo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [markers,setMarkers] = useState([])
  const [filter,setFilter] = useState(null)
  const navigation = useNavigation();

  
 const navigateToDetailsAnimal = () => {
    setModalVisible(false);
    navigation.navigate('DetailsAnimal', { animal: selectedAnimal });
  };

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
    latitudeDelta: 2.005,
    longitudeDelta: 2.005,
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
        >
          {
            marker.animal.urlImage === "" || marker.animal.urlImage == null 
            ?
             <Image
              source={require('../../assets/imageNotFound.jpg')}
              style={{ width: 50 , height: 50  }}
            />
            :
      <Image
              source={{ uri: marker.animal.urlImage }}
              style={{ width: 35, height: 35,borderRadius: 10, borderWidth: 2, borderColor: "rgba(86, 231, 130, 1)"  }}
            /> 


          }
        </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={[styles.btnSelectInfo, {left: "25%"}]}
        onPress={() => getMarkers()}
      >
        <MaterialIcons name="autorenew" size={30} color="black" />
      </TouchableOpacity>

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
                  {
                    selectedAnimal != null
                    ?
                      <Image
                        source={
                          selectedAnimal.urlImage === "" || selectedAnimal.urlImage == null
                            ? require('../../assets/imageNotFound.jpg')
                            : { uri: selectedAnimal.urlImage }
                        }
                        style={styles.animalImage}
                        
                      />
                    : null
                  }
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.animalDescription}>
                  {selectedAnimal?.name || 'Nombre no disponible'}
                </Text>
                  <TouchableOpacity
                  onPress={() => navigateToDetailsAnimal()}
                  style={styles.btnGoToDetailsAnimal}
                >
                  <Text style= {styles.btnGoToDetailsAnimalText}>Conocer más detalles</Text>
                </TouchableOpacity>
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
 btnGoToDetailsAnimal: {
  backgroundColor: '#4CAF50',
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  alignItems: 'center',
  justifyContent: 'center',
},
btnGoToDetailsAnimalText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  textTransform: 'uppercase',
},
viewImage:{
  width: 150,
  height: 150,
  backgroundColor: "rgba(95, 211, 166, 1)",
  padding: 7,
  borderRadius: 15
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
    height: "50%",
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  
  },
  infoContainer: { padding: 20 },
  animalDescription: { fontSize: 19, color: '#ffffffff', textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  coordinatesContainer: { backgroundColor: '#f0f8f0', borderRadius: 10, padding: 15 },
  coordinateItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  coordinateText: { marginLeft: 10, fontSize: 14, color: '#555' },
});
