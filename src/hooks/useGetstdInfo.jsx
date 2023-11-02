import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";

export const useGetstdInfo = () => {
  const [fetchData, setFetchData] = useState([]);

  useEffect(() => {
    const fetchDataFunc = async () => {
      let list = [];

      try {
        const querySnapshot = await getDocs(collection(db, "studentdata"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFetchData(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataFunc();
  }, []);

  return { fetchData };
};
