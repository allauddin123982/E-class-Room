import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase-config";
export const useAddStdInfo = () => {
  const addStdInfoCollectionRef = collection(db, "studentdata");
  const addStdInfo = async ({name,reg,sem}) => {
    await addDoc(addStdInfoCollectionRef, {
      userID,
      name,
      reg,
      sem,
      createdAt: serverTimestamp(),
    });
  };
  return { addStdInfo };
};
