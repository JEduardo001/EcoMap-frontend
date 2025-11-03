import React,{useEffect,useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {fetchSpecies,fetchSpeciesByFilter} from "../services/api/index.js"
import {filters} from "../constants/Filters.js"
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export const Species = () => {
  const navigation = useNavigation();
  const [species,setSpecies] = useState([])
  const [filter,setFilter] = useState(null)

  const navigateToDetailsAnimal = (animal) => {
    navigation.navigate('DetailsAnimal', { animal });
  };


  const getSpeciesByFilters = async () => {
      if(!filter){
        getSpecies()
        return
      }
      const response = await fetchSpeciesByFilter(filter)
      if(response.status != 200){
        console.error("Error fetching species by filter")
      }
      setSpecies(response.data)
    }

  useEffect(() => {
    getSpecies()
  },[])

  useEffect(() => {
    getSpeciesByFilters()
  },[filter])

  const getSpecies = async () => {
    const response = await fetchSpecies()
    if(response.status != 200){
        console.error("Error fetching species")
    }
    setSpecies(response.data)
  }

  //source={require('../ ../assets/turtle.png')}
  const renderCard = ({ item }) => (
  <TouchableOpacity style={styles.card} onPress={() => navigateToDetailsAnimal(item)}>
    <ImageBackground
      source={
        item.urlImage === "" || item.urlImage == null
          ? require('../../assets/imageNotFound.jpg')
          : { uri: item.urlImage }
      }
      style={styles.backgroundImageCard}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
       {/* 
  <Image source={{ uri: item.urlImage }} style={styles.image} /> 
  */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.category.name}</Text>
        <MaterialIcons name="info-outline" size={24} color="#4CAF50" />
      </View>
    </ImageBackground>

  </TouchableOpacity>
);

  return (
    <ImageBackground
      source={require('../../assets/fondo1.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.colorOverlay} />

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.header}>Especies destacadas</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}
          style={{ maxHeight: 50, padding: 7 }}
          >
          <TouchableOpacity
              style={styles.containerSectionInfo}
              onPress={() => setFilter(null)}
          >
              <MaterialIcons name="edit" size={24} color="#ffd700" />
              <Text style={styles.sectionText}>Quitar Filtros</Text>
          </TouchableOpacity>

          {filters.map((filter) => (
              <TouchableOpacity
              key={filter.id}
              style={styles.containerSectionInfo}
              onPress={() => setFilter(filter.id)}
              >
              <MaterialIcons name="edit" size={24} color="#ffd700" />
              <Text style={styles.sectionText}>Mostrar {filter.name}</Text>
              </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.btnReload, {left: "10%"}]}
          onPress={() => getSpecies()}
        >
          <MaterialIcons name="autorenew" size={30} color="black" />
        </TouchableOpacity>

        
        {
            species.length === 0 ? 
                <View  style={{marginTop: 30, flex: 1,  alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontWeight: '700',fontSize: 20}}>No hay especies</Text>
                </View>
            :
             <FlatList
                style={{marginTop: 30,flex: 1, }}
                data={species}
                renderItem={renderCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        }
       
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  colorOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#ffffff',
  },
  btnReload: {
    width: 50,
    height: 50,
    top: 10,
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
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.43)',
    borderRadius: 16,
    marginBottom: 30,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    position: 'relative',
  },
  backgroundImageCard: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.8,
    position: 'absolute',
    top: -40,
    right: 20,
    resizeMode: 'contain',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#cfd8dc',
    marginBottom: 6,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
  },
  containerSectionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2b2b3f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginRight: 10,
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
});
