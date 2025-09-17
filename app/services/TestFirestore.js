import { db } from "../../firebaseConfig/FirebaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Agregar un documento
export const addUser = async () => {
    try {
        await addDoc(collection(db, "users"), { name: "Eduardo", age: 25 });

    }catch(error){
        console.error("Error al anadir el elemento: ", error)
    }
}
// Leer documentos
export const getUsers = async () => {
    try{
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }catch(error){
        console.error("Error al obtener lo elementos: ", error)
    }
}