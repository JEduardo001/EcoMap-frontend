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

export const Profile = () => {
    return (
        <Text>Pantalla perfil</Text>
    )
}