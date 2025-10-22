import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, StatusBar, SafeAreaView, Modal 
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { addUser } from "../services/TestFirestore.js";
import  {submitNewMarket } from "../services/api/index.js"
import {filters} from "../constants/Filters.js"

export const CreateMark = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(filters[0].id);
  const [image, setImage] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [sendingCreateMark, setSendingCreateMark] = useState(false)
  const [latitude, setLatitude] = useState(24.14231);
  const [longitude, setLongitude] = useState(-110.31316);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [listCuriousThings,setListCuriousThings] = useState([])
  const [curiousThing,setCuriousThing] = useState(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setModalTitle("Permisos requeridos");
      setModalMessage("Se necesitan permisos para acceder a la galería");
      setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      setImage(image.uri);

      setImageObject(image);
    }
  };

  const addCuriousThings = () => {
    if (curiousThing) {
      setListCuriousThings([...listCuriousThings, curiousThing]);
      setCuriousThing(null);
    }
  };


  const deleteCuriousThings = (index) => {
    const updatedList = [...listCuriousThings];
    updatedList.splice(index, 1);
    setListCuriousThings(updatedList);
  };


  const visibleModal = (title, message) => {
      setModalTitle(title);
      setModalMessage(message);
      setModalVisible(true);
  }

  const handleSubmit = async () => {
    if(sendingCreateMark){
      return
    }
    setSendingCreateMark(true)
    if (!name || !description || !latitude || !longitude) {
      visibleModal("Falta información", "Porfavor completa todos los campos requeridos");
      return;
    }
    
    const newMark = { name, description, category, imageObject, latitude, longitude, listCuriousThings };
    const responseSumitMarket = await submitNewMarket(newMark)
    if(responseSumitMarket.status != 200){
      visibleModal("Ocurrió un problema", "No se pudo agregar el animal, intenta nuevamente");
      return
    }

    visibleModal("Éxito", "Animal agregado correctamente");
    setSendingCreateMark(false)
    resetForm()
  };

  const resetForm = () => {
    setName(""); 
    setDescription(""); 
    setCategory("fauna"); 
    setImage(null); 
    setLatitude(24.14231); 
    setLongitude(-110.31316);
    setListCuriousThings([])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Agregar Nuevo Animal</Text>

        <Text style={styles.label}>Imagen</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <Text style={styles.imageText}>Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nombre</Text>
        <Text style={[styles.label, {color: "red", fontSize: 12}]}>Requerido</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del animal"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descripción</Text>
        <Text style={[styles.label, {color: "red", fontSize: 12}]}>Requerido</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción"
          placeholderTextColor="#666"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Lista de datos curiosos</Text>
        <View style={{ flexDirection: "row",  width: "100%", justifyContent: "center", alignItems: "center", gap: 10 }}>
        <TextInput
          style={[styles.inputCuriosDetails, { height: 100, textAlignVertical: 'top', flex: 1, marginRight: 10 }]}
          placeholder="Algún dato curioso"
          placeholderTextColor="#666"
          multiline
          value={curiousThing}
          onChangeText={setCuriousThing}
        />

          <TouchableOpacity style={styles.btnAddCouriousThing} onPress={addCuriousThings}>
            <Text style={styles.submitText}>Añadir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Elementos</Text>
        <View style={styles.pickerContainer}>
          {
          listCuriousThings.length == 0
          ?  <Text style={styles.label}>Sin elementos</Text>
          :
            listCuriousThings.map((el,index) => {
              return (
                <View key={index} style = {{borderRadius: 10, padding: 7, flexDirection: "row", width: "70%", justifyContent: "space-between"}}>
                  <Text style={styles.label}>{el}</Text>
                  <TouchableOpacity style={styles.btnDeleteCouriousThing} onPress={() => deleteCuriousThings(index)}>
                    <Text style={[styles.submitText, {fontSize: 13}]}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )
            })
        }
        </View>

        <Text style={styles.label}>Categoría</Text>
        <Text style={[styles.label, {color: "red", fontSize: 12}]}>Requerido</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
           
            {filters.map((filter) => {
              return (   <Picker.Item
                label={`${filter.name}`}
                value={filter.id}
              />)
            })}
          </Picker>
        </View>

        <Text style={styles.label}>Ubicación</Text>
        <Text style={styles.tooltip}>Arrastra el marcador o ajusta las coordenadas manualmente</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            draggable
            onDragEnd={(e) => {
              setLatitude(e.nativeEvent.coordinate.latitude);
              setLongitude(e.nativeEvent.coordinate.longitude);
            }}
          />
        </MapView>

        <View style={styles.coordinates}>
          <TextInput
            style={styles.inputCoord}
            keyboardType="numeric"
            value={latitude.toString()}
            onChangeText={(val) => setLatitude(parseFloat(val))}
          />
          <TextInput
            style={styles.inputCoord}
            keyboardType="numeric"
            value={longitude.toString()}
            onChangeText={(val) => setLongitude(parseFloat(val))}
          />
        </View>

        <TouchableOpacity style={[styles.submitButton, sendingCreateMark ? {backgroundColor: "#5d5e5dff",} : {backgroundColor: "#4CAF50",}]} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {
              sendingCreateMark ? "Enviando..." : "Agregar Animal"
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>

     <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, modalTitle === "Éxito" ? styles.successModal : styles.errorModal]}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 20, paddingBottom: 50 },
  header: { marginTop: 20, fontSize: 28, fontWeight: "700", color: "#333", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#555", marginBottom: 6, marginTop: 12 },
  tooltip: { color: "#4CAF50", marginBottom: 8, fontSize: 14 },
  input: { backgroundColor: "#fff", color: "#333", padding: 12, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  inputCuriosDetails: { backgroundColor: "#fff", color: "#333", padding: 12, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  picker: { color: "#333" },
  imagePicker: { backgroundColor: "#e0e0e0", height: 200, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 6, marginBottom: 8 },
  previewImage: { width: "100%", height: "100%", borderRadius: 16 },
  imageText: { color: "#666", fontSize: 16 },
  map: { width: "100%", height: 300, borderRadius: 16, marginBottom: 10 },
  coordinates: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inputCoord: { backgroundColor: '#fff', color: '#333', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', width: '48%', textAlign: 'center' },
  submitButton: {  paddingVertical: 15, borderRadius: 16, marginTop: 15, alignItems: "center" },
  btnAddCouriousThing: { backgroundColor: "#4CAF50", padding: 11, borderRadius: 16,  alignItems: "center" },
  btnDeleteCouriousThing:  { backgroundColor: "#cf5555ff", height: 38, padding: 11, borderRadius: 16,  alignItems: "center" },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "700" },
 modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
modalContainer: {
  width: '100%',
  borderRadius: 20,
  paddingVertical: 25,
  paddingHorizontal: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 10,
},
successModal: {
  backgroundColor: '#E6F9F1',
},
errorModal: {
  backgroundColor: '#FFE6E6',
},
modalTitle: {
  fontSize: 22,
  fontWeight: '700',
  marginBottom: 10,
  color: '#333',
  textAlign: 'center',
},
modalMessage: {
  fontSize: 16,
  color: '#555',
  textAlign: 'center',
  marginBottom: 20,
},
modalButton: {
  backgroundColor: '#4CAF50',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 12,
  elevation: 3,
},
modalButtonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 16,
},

});
