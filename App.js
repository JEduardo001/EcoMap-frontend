import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import {StatusBar} from "react-native"
import {Home} from "./app/screens/Home.js"
import {DetailsAnimals} from "./app/screens/DetailsAnimals.js"
import {TestFirebase} from "./app/screens/TestFirebase.js"

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//screenOptions={{ headerShown: false }}
const Tabs = () => {
  return  (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
       <Tab.Screen name="Home" component={Home}  
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" color={color} size={size} />
          ),
          title: "Mapa"
        }}
      />
      <Tab.Screen name="DetailsAnimals" component={DetailsAnimals} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" color={color} size={size} />
          ),
          title: "Detalles Animales"
        }}
      />
      <Tab.Screen name="TestFirebase" component={TestFirebase} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" color={color} size={size} />
          ),
          title: "Test"
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          </Stack.Navigator>
      </NavigationContainer>
    </>
    
  );
}