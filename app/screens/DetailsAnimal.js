import React from "react";
import { View, StyleSheet, ScrollView, Dimensions,FlatList,TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {TextSize} from "../components/Text.js"
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get("window");

export const DetailsAnimal = ({ route }) => {
  const { animal } = route.params;

  const getImage = (animal) => {
    if(animal.urlGift == "" || animal.urlGift == null){
      if(animal.urlImage == "" || animal.urlImage == null){
          return require('../../assets/imageNotFound.jpg')
        }
        return { uri: animal.urlImage
      }
    }
    return  { uri: animal.urlGift }
  }

  return (
      <ScrollView style={styles.container}>

        <Image
          source={
              getImage(animal)
            }
          style={styles.sharkGif}
          resizeMode="cover"
        />

        {/* Degradado oscuro para resaltar texto */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        />

        {/* Texto con efecto de brillo */}
        <View style={styles.textOverlay}>
          <TextSize style={styles.glowText}>{animal.name}</TextSize>
        </View>
        <View style = {styles.infoContainer}>
          <View style ={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <TextSize style={styles.infoTitle}>Descripción</TextSize>
            <View style ={styles.containerIconsAdditional}>
              
              <TouchableOpacity style={[styles.button, styles.favoriteButton]}>
                <Ionicons name="star" size={28} color="yellow" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.likeButton]}>
                <Ionicons name="heart" size={28} color="red" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.learnButton]}>
                <Ionicons name="book" size={28} color="green" />
              </TouchableOpacity>

            </View>

          </View>
          <TextSize style={styles.infoText}>
            {animal.description}
          </TextSize>

            <View style ={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
             <Ionicons name="bulb-outline" size={28} color="yellow" />
              <TextSize  style={styles.infoTitle}>Curiosidades</TextSize>
            </View>
         
          {
            animal.curiousThings.length != 0
            ?
              <FlatList
                scrollEnabled={false}
                style={{ marginTop: 30 }}
                data={animal.curiousThings} 
                renderItem={({ item }) => (
                  <TextSize style={styles.infoText}>
                    - {item}
                  </TextSize>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            : null
          }

        
        </View>
        
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", 
  },
  containerIconsAdditional: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "40%",
    position: "absolute",
    right: 0
  },
  sharkGif: {
    borderRadius: 20,
    width: width,
    height: height * 0.45, 
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.25,
    height: height * 0.2,
  },
  textOverlay: {
    position: "absolute",
    top: height * 0.35,
    left: 20,
  },
  glowText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    textShadowColor: "rgba(255,255,255,0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  infoContainer: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(40, 117, 210,0.5)", 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 5,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b8b8bff',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  favoriteButton: {
    backgroundColor: '#bdcf13ff',
    
  },
  likeButton: {
    backgroundColor: '#ffa4a4ff',
  },
  learnButton: {
    backgroundColor: '#9cf8ffff',
  
  },
});
