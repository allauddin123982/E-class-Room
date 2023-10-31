import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
export const useGetstdInfo = () => {
  const [fetchStdData, setFetchStdData] = useState([]);
  const fetchStdInfoCollectionRef = collection(db, "studentdata");
  const { userID } = useGetUserInfo();
  console.log({userID})
  const getData = async () => {
    let unSubscribe;
    try {
      const queryData = query(
        fetchStdInfoCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      );
      unSubscribe = onSnapshot(queryData, (snapshot) => {
        let docs = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const id = doc.id;
          docs.push({ ...data, id });
        });
        setFetchStdData(docs);
      });
    } catch (error) {
      console.log(error);
    }
    return () => unSubscribe();
  };

  useEffect(() => {
    getData();
  }, []);

  return { fetchStdData };
};
