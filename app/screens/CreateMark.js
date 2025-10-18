import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  Image, ScrollView, StatusBar, SafeAreaView, Modal 
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import { addUser } from "../services/TestFirestore.js";
import  {submitNewMarket, submitImage} from "../services/api/index.js"

export const CreateMark = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fauna");
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState(24.14231);
  const [longitude, setLongitude] = useState(-110.31316);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setModalTitle("Permisos requeridos");
      setModalMessage("Se necesitan permisos para acceder a la galería");
      setModalVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const visibleModal = (title, message) => {
      setModalTitle(title);
      setModalMessage(message);
      setModalVisible(true);
  }

  const handleSubmit = async () => {

    if (!name || !description || !latitude || !longitude) {
      visibleModal("Error", "Todos los campos son obligatorios");
      return;
    }

    const reponseSubmitImage = await submitImage(image)
    if(reponseSubmitImage.status != 200){
      visibleModal("Ocurrió un problema", "No se pudo subir la imagen, intenta nuevamente");
      return
    }
    const imageUrl = reponseSubmitImage.data;
    console.log("Image URL:", imageUrl);
    const newMark = { name, description, category, imageUrl, latitude, longitude };
    const responseSumitMarket = await submitNewMarket(newMark)
    if(responseSumitMarket.status != 200){
      visibleModal("Ocurrió un problema", "No se pudo agregar el animal, intenta nuevamente");
      return
    }

    visibleModal("Éxito", "Animal agregado correctamente");
    resetForm()
  };

  const resetForm = () => {
    setName(""); 
    setDescription(""); 
    setCategory("fauna"); 
    setImage(null); 
    setLatitude(24.14231); 
    setLongitude(-110.31316);
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
        <TextInput
          style={styles.input}
          placeholder="Nombre del animal"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción"
          placeholderTextColor="#666"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Fauna" value="fauna" />
            <Picker.Item label="Flora" value="flora" />
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Agregar Animal</Text>
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
  pickerContainer: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ddd", marginBottom: 8 },
  picker: { color: "#333" },
  imagePicker: { backgroundColor: "#e0e0e0", height: 200, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 6, marginBottom: 8 },
  previewImage: { width: "100%", height: "100%", borderRadius: 16 },
  imageText: { color: "#666", fontSize: 16 },
  map: { width: "100%", height: 300, borderRadius: 16, marginBottom: 10 },
  coordinates: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  inputCoord: { backgroundColor: '#fff', color: '#333', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', width: '48%', textAlign: 'center' },
  submitButton: { backgroundColor: "#4CAF50", paddingVertical: 15, borderRadius: 16, marginTop: 15, alignItems: "center" },
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
