import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getUserData = async (userId) => {
    const userDoc = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDoc);
    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return data;
    } else {
        console.log("No such user");
        return null;
    }
}

export const setHR = async (userId, heartRate) => {
    const userRef = doc(db, "Users", userId);

    // Set the "capital" field of the city 'DC'
    await updateDoc(userRef, {
      restingBpm: heartRate
    });
    console.log("updating hr")
}

