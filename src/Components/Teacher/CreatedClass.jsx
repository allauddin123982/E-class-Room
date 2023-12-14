import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState({});
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchCreatedClass = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let data = {};
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setCreatedClass(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCreatedClass();
  }, []);

  const handleClick = (className) => {
    const modal = document.getElementById("modal");
    modal.showModal();
    setClasses(createdClass[className]);
  };

  return (
    <>
      <div>
        Created Classes
        <div className="absolute  bg-white top-24 left-96 p-10 rounded-xl shadow-2xl ">
          <div className="flex gap-4 ">
            {Object.keys(createdClass).map((className, index) => (
              <div key={index} 
              className="w-[200px] h-[70px] p-4 rounded-md shadow-md bg-slate-200 hover:border-2 border-black cursor-pointer"
              onClick={() => handleClick(className)}
              >
                <h2 className="text-lg font-semibold">{className}</h2>
              </div>
            ))}
          </div>
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
          <button className=" p-1 rounded-lg">Start Class</button>

          {classes && Object.keys(classes).length > 0 ? (
            <table className="table-auto m-5 w-[800px]">
              <thead>
                <tr className="border-b bg-gray-900 text-white h-14">
                  <th className=" px-4 ">Image</th>
                  <th>Name</th>
                  <th>Registration</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(classes).map((userId, index) => {
                  const user = classes[userId];
                  return (
                    <tr
                      key={index}
                      className="border-b even:bg-gray-100 rounded-2xl"
                    >
                      <td className="p-1 flex justify-center">
                        <p>
                          <img
                            src={user.img}
                            alt="no img"
                            className="w-12 h-12 rounded-full "
                          />
                        </p>
                      </td>
                      <td>{user.namee}</td>
                      <td>{user.reg}</td>
                      <td>{user.sem}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No user data available</p>
          )}
        </div>
      </dialog>
    </>
  );
};

export default CreatedClass;
