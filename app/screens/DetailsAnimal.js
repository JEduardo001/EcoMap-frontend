import React from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions,FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {TextSize} from "../components/Text.js"

const { width, height } = Dimensions.get("window");

export const DetailsAnimal = ({ route }) => {
  const { animal } = route.params;
  console.log("DetailsAnimal received animal:", animal);
  return (
      <ScrollView style={styles.container}>
            {/* GIF del tiburón */}
        <Image
          source={require("../../assets/tiburonGift1.gif")}
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
          <TextSize style={styles.infoTitle}>Descripción</TextSize>
          <TextSize style={styles.infoText}>
            {animal.description}
          </TextSize>

          <TextSize  style={styles.infoTitle}>Curiosidades</TextSize>
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
});
