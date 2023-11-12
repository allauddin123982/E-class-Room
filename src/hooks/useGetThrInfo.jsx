import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";

export const useGetThrInfo = () => {
  const [fetchThrData, setFetchThrData] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchThrDataFunc = async () => {
      let list = [];

      try {
        const querySnapshot = await getDocs(
          collection(db, `teacherdata/${id}/subcollection`)
        );
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFetchThrData(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchThrDataFunc();
  }, []);

  return { fetchThrData };
};
