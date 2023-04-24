import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export const getFirstName = async (userId) => {
    const userDoc = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDoc);
    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return data.firstName;
    } else {
        console.log("No such user");
        return null;
    }
}

