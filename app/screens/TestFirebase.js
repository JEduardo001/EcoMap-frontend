import React, {useEffect, useState} from "react"
import {View,Text,StyleSheet, TouchableOpacity, Modal,FlatList} from "react-native"
import {addUser, getUsers} from "../services/TestFirestore.js"

export const TestFirebase = () => {

    const [users, setUsers] = useState([])
    const [creatingUser, setCreatingUser] = useState(false)

    
    const addNewUser = async () => {
        console.log("creando usuario...")
        setCreatingUser(true)
        await addUser()
        const users = await getUsers()
        setUsers(users)
        setCreatingUser(false)

    } 
    
    return (
        <View style = {styles.container}>
            <Text>Integración Firestore</Text>
            <TouchableOpacity
                style = {styles.btnAddUser}
                onPress={addNewUser}
                disabled={creatingUser}

                >
                <Text>
                    {
                        creatingUser ? "Creando usuario..." : "Crear usuario"
                    }
                </Text>
            </TouchableOpacity>
                
            <View style = {styles.containerListUsers}>
            {
                users.length == 0
                ? <Text>No hay usuarios</Text>
                : 
                    <FlatList
                    data={users}
                    renderItem={({item}) => (
                        <View>
                            <Text>{item.name}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    >
                    
                    </FlatList>
            }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        justifyContent: "center",
    },
    btnAddUser: {
        backgroundColor: "rgb(191, 235, 174)",
        borderRadius: 10,
        padding: 7,
        alignItems: "center"
    },
    containerListUsers: {
        flex: 1,
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
      
    }
})