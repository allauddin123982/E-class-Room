import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState({});
  const [classes, setClasses] = useState([]);
  const [classTiming, setClassTiming] = useState("");

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
    setClassTiming(classes.ClassTiming);
  };

  return (
    <>
      {Object.keys(createdClass).length > 0 ? (
        <div className="absolute bg-white top-24 left-96 max-w-[1060px] p-10 rounded-xl shadow-2xl">
          <div className="flex flex-wrap gap-4">
            {Object.keys(createdClass).map((className, index) => (
              <div
                key={index}
                className="w-[150px] h-[70px] p-4 rounded-md shadow-md bg-slate-200 hover:border-b-2 border-black cursor-pointer"
                onClick={() => handleClick(className)}
              >
                <h2 className="text-lg font-semibold">{className}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-red-600 text-2xl">No classes</p>
      )}

      <dialog id="modal" className="shadow-2xl rounded-lg">
        <div className="w-[850px] h-[550px]">
          <div className="flex justify-end p-4">
            <button onClick={() => document.getElementById("modal").close()}>
              X
            </button>
          </div>
          <div className="flex justify-between items-center px-10">
            <button className="w-[120px] bg-gray-200 p-1 rounded-lg">
              Start Class
            </button>

            <p> Class will start at {classes.ClassTiming}</p>
          </div>
          {classes && Object.keys(classes).length > 0 ? (
            <table className="table-auto m-5 w-[800px]">
              <thead>
                <tr className="bg-gray-900 text-white h-14">
                  <th className=" px-4 ">Image</th>
                  <th>Name</th>
                  <th>Registration</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(classes).map((userId, index) => {
                  if (userId !== "ClassTiming") {
                    const user = classes[userId];
                    console.log(user);
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
                  }

                  return null; // Skip rendering for ClassTiming
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
