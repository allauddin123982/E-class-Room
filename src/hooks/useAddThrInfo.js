import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { db } from "../firebase-config";
export const useAddThrInfo = () => {
  const addThrInfoCollectionRef = collection(db, "teacherdata");
  const { userID } = useGetUserInfo();
  const addThrInfo = async ({ name, qua, des }) => {
    await addDoc(addThrInfoCollectionRef, {
      userID,
      name,
      qua,
      des,
      createdAt: serverTimestamp(),
    });
  };
  return { addThrInfo };
};
