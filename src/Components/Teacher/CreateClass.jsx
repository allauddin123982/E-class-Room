import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";

const CreateClass = () => {
  const [fetchStudentData, setFetchStudentData] = useState([]);
  const [className, setClassName] = useState("");
  // const [isChecked, setIsChecked] = useState(false);
  const [stdList, setStdList] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchStudentData = async () => {
      let list = [];

      try {
        const querySnapshot = await getDocs(collection(db, `studentdata/`));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFetchStudentData(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchStudentData();
    console.error("Error fetching data:", fetchStudentData);
  }, []);


  const addStdInClass = (student) => {
    // Check if the student is already in stdList
    const isStudentInList = stdList.some((std) => std.uid === student.uid);

    if (isStudentInList) {
      setStdList((prevList) =>
        prevList.filter((std) => std.uid !== student.uid)
      );
    } else {
      // If not, add the student to stdList
      setStdList((prevList) => [...prevList, student]);
    }
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, 'createClass', className);
  
      await setDoc(
        userDocRef,
        {
          ...stdList,
          timeStamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
      <div className="absolute bg-white top-24 left-96 p-4 rounded-xl shadow-xl">
        <div className="flex gap-x-2">
          <input
            type="text"
            className="border p-1"
            placeholder="Class name"
            onChange={(e) => setClassName(e.target.value)}
          />
          <button className="border p-1 rounded-lg" onClick={createClass}>
            Create
          </button>
        </div>
        <table className="table w-[400px] ">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Reg no </th>
              <th>Semester</th>
              <th>Add</th>
            </tr>
          </thead>

          <tbody>
            {fetchStudentData.map((element, index) => (
              <tr key={index} className=" hover:bg-gray-100 transition-all">
                <td className="p-2">
                  <img
                    src={element.img}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </td>
                <td>{element.namee}</td>
                <td>{element.reg}</td>
                <td>{element.sem}</td>

                <td>
                  <input
                    type="checkbox"
                    checked={stdList.some((std) => std.uid === element.uid)}
                    onChange={() => addStdInClass(element)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CreateClass;
