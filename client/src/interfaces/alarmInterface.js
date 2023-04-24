import { db } from "../config/firebase";
import { doc, deleteDoc, addDoc, query, where, getDocs, collection, orderBy } from "firebase/firestore";

export const createAlarm = async (userId, title, startTime, endTime) => {
    if (userId === "") return;
    try {
      const docRef = await addDoc(collection(db, "Alarms"), {
        userId: userId,
        alarmName: title,
        startTime: startTime.toDate(),
        endTime: endTime.toDate(),
        isActive: false
      });
      console.log("Alarm written with ID: ", docRef.id);
      return docRef.id
    } catch (e) {
      console.error("Error adding alarm: ", e);
    }
  };

  export const deleteAlarm = async (alarmId) => {
    if (alarmId === "") return;
    await deleteDoc(doc(db, "Alarms", alarmId));
    console.log(`Alarm ${alarmId} has been deleted`)
    return
  }


export const getUserAlarms = async (userId) => {
    let alarms = []
    const alarmsRef = collection(db, "Alarms");
    const q = query(alarmsRef, where("userId", "==", userId), orderBy("endTime")); 
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let id = doc.id
      alarms[id] = doc.data()
      //console.log(doc.id, " => ", doc.data());
    });

    return alarms
  }