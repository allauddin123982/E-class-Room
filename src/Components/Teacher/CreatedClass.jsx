import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // classCreated fetch that students
    const fetchCreatedClass = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCreatedClass(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchCreatedClass();
  }, []);
  
  useEffect(() => {
    console.log("Classes:", classes);
  }, [classes]);
  
  const handleClick = (element) => {
    const modal = document.getElementById("modal");
    modal.showModal();
    setClasses((prevClasses) => [...prevClasses, element]);
  };

  console.log("helo", classes);
  return (
    <>
      <div>
        Created Classes
        <div className="absolute bg-white top-24 left-96 p-4 rounded-xl shadow-xl">
          <table className="table w-[400px] ">
            <thead>
              <tr>
                <th>Class Name</th>
              </tr>
            </thead>
            <tbody>
              {createdClass.map((element, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all">
                  <td>{element.id}</td>
                  <td>
                    <button onClick={() => handleClick(element)}>
                      Open Modal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id="modal">
        <div className="w-[850px] h-[550px]">
          <div className="flex justify-between p-4">
            <p>Check student</p>
            <button onClick={() => document.getElementById("modal").close()}>
              X
            </button>
          </div>
          <button className="border p-1 rounded-lg">Start Class</button>
          <div>
            {classes.map((classItem, index) => (
              <div key={index}>
                {Object.values(classItem).map((nestedObject, nestedIndex) => (
                  <div key={nestedIndex}>
                    <p><img src={nestedObject.img} alt="" className="h-16 w-16" /></p>
                    <p>Name: {nestedObject.namee}</p>
                    <p>Semester: {nestedObject.sem}</p>
                    <p>Reg: {nestedObject.reg}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreatedClass;
