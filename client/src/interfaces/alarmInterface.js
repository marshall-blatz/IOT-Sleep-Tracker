import { db } from "../config/firebase";
import { doc, deleteDoc, addDoc, setDoc, query, where, getDocs, collection, orderBy, writeBatch } from "firebase/firestore";

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
  window.location.reload()
}

export const setAlarmToggle = async (alarmId, status) => {
  if (alarmId === "") return;
  try {
    const alarmDoc = doc(db, "Alarms", alarmId);
    if (status === true){
      await setDoc(alarmDoc, { isActive: true }, { merge: true });
    }
    else {
      await setDoc(alarmDoc, { isActive: false }, { merge: true });
    }
    console.log(`Alarm ${alarmDoc.id} toggle updated successfully`);
  } catch (e) {
    console.error(`Error updating alarm toggle: `, e);
  }
}

export const getUserAlarms = async (userId) => {
  console.log("getting user alarms")
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

export const deactivateAlarms = async () => {
  const alarmsRef = collection(db, "Alarms")
  const snapshot = await getDocs(alarmsRef)
  const batch = writeBatch(db)
  snapshot.forEach((doc) => {
    batch.update(doc.ref, { isActive: false });
  });

  await batch.commit();
}