import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { IoSearch } from "react-icons/io5";
import { useParams } from "react-router-dom";
const CreateClass = () => {
  const [fetchStudentData, setFetchStudentData] = useState([]);
  const [searched, setSearched] = useState(false);
  const [className, setClassName] = useState("");
  const [classTime, setClassTime] = useState("");
  const [stdList, setStdList] = useState([]);
  const [takeName, setTakeName] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const { id } = useParams();
  
  //fetchStudents
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
  
  }, []);


  const addStdInClass = (student) => {
    //2
    // Check if the student is already in stdList
    const isStudentInList = stdList.some((std) => std.uid === student.uid); //3

    if (isStudentInList) {
      setStdList((prevList) =>
        prevList.filter((std) => std.uid !== student.uid)
      );
    } else {
      // If not, add the student to stdList
      setStdList((prevList) => [...prevList, student]); //4
    }
  };

  //Teacher createClass
  const createClass = async (e) => {
    e.preventDefault();
    try {
      stdList.forEach(student => {
        student.popUp = false;
        student.attendance = false;
      });
  
      const userDocRef = doc(db, `createClass/`, className);
      await setDoc(userDocRef, {
         ...stdList,
        ClassTeacherID: id //that current Teacher who created class
      });
  
      console.log("Class created successfully");
    } catch (error) {
      console.error("Error creating class: ", error);
    }
  };

 
  // searchStudentFunc by reg no
  const searchStudentFunc = () => {
    const foundStudent = fetchStudentData.find(
      (student) => student.reg.toLowerCase() === takeName.toLowerCase()
    );
    setFoundStudent(foundStudent);
    setSearched(true);
    
  };
  const showAllStudents = () => {
    setSearched(false);
    setTakeName("");
  };

  // console.log({stdList})
  return (
    <>
      <div className="bg-white shadow-lg  border-black w-[350px] p-2 absolute right-0 top-20 mx-20 flex justify-center gap-3 rounded-lg">
        <input
          type="text"
          value={takeName}
          placeholder="Reg no"
          className="border p-1 rounded"
          onChange={(e) => {
            setTakeName(e.target.value);
          }}
        />
        <button
          onClick={searchStudentFunc}
          className="hover:border border-black p-1 bg-gray-200 w-[40px] text-center flex justify-center items-center rounded-lg"
        >
          <IoSearch className="text-xl " />
        </button>
        <button
          onClick={showAllStudents}
          className="p-1 bg-gray-200 text-bold rounded-lg hover:border border-black"
        >
          Show All
        </button>
      </div>
      <div className="absolute bg-white top-24 left-96 w-[650px] p-4 rounded-xl shadow-xl">
        <div className="flex gap-x-2">
          <input
            type="text"
            className="border p-1"
            placeholder="Class name"
            onChange={(e) => setClassName(e.target.value)}
          />

          <button
            className="border p-1 bg-gray-200 w-[80px] font-semibold rounded-lg hover:border hover:border-black"
            onClick={createClass}
          >
            Create
          </button>
        </div>
        <table className="table w-[600px] mt-4">
          <thead>
            <tr className="bg-gray-900 text-white h-14 w-[530px]">
              <th>-</th>
              <th>Name</th>
              <th>Reg no </th>
              <th>Semester</th>
              <th>Add</th>
            </tr>
          </thead>

          <tbody>
            {searched && !foundStudent ? (
              <tr>
                <td colSpan="5">
                  <p>No student found</p>
                </td>
              </tr>
            ) : (
              searched &&
              foundStudent && (
                <tr className="hover:bg-gray-100 transition-all">
                  <td className="p-2 flex justify-center">
                    <p>
                      <img
                        src={foundStudent.img}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </p>
                  </td>
                  <td className="text-left">{foundStudent.namee}</td>
                  <td>{foundStudent.reg}</td>
                  <td>{foundStudent.sem}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={stdList.some((std) => std.uid === foundStudent.uid)}
                      onChange={() => addStdInClass(foundStudent)}
                    />
                  </td>
                </tr>
              )
            )}

            {!searched &&
              fetchStudentData.map((element, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all">
                  <td className="p-2 flex justify-center">
                    <p>
                      <img
                        src={element.img}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </p>
                  </td>
                  <td className="text-left">{element.namee}</td>
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
