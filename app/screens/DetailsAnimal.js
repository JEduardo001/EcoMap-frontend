import React from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
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
          <TextSize style={styles.infoText}>
            - Pueden detectar campos eléctricos de otros animales.{"\n"}
            - Algunos tiburones pueden vivir más de 70 años.{"\n"}
            - Tienen varias filas de dientes que se reemplazan continuamente.{"\n"}
            - Son cruciales para la salud de los arrecifes de coral y ecosistemas marinos.
          </TextSize>
        </View>
        
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // para resaltar GIF y degradado
  },
  sharkGif: {
    borderRadius: 20,
    width: width,
    height: height * 0.45, // ocupa casi la mitad de la pantalla
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.25, // comienza un poco abajo del top del GIF
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
    backgroundColor: "rgba(40, 117, 210,0.5)", // contraste con GIF
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 5, // para superponer un poco sobre el GIF
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
