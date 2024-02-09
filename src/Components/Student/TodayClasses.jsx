import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";

const TodayClasses = () => {
  const [fetchClasses, setFetchClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all classes
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        // console.log("data : ", data);

        // Find classes where at least one student has a matching uid
        let matchingClasses = data.filter((classObj) => {
          return Object.keys(classObj).some((key) => {
            const student = classObj[key];
            return student.uid === id;
          });
        });
        // console.log("matchingClasses : ", matchingClasses);
        
        // Update state with the matched classes (or an empty array if no match)
        setFetchClasses(matchingClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function here
  }, [id]); // Make sure to include 'iddd' in the dependency array

  // console.log("fetched ", fetchClasses);

  const handleClick = (className) => {
    // console.log("fetchClasses:", className);
    const modal = document.getElementById("modal");
    modal.showModal();
    setClasses(className);
  };

  // console.log("helo world", classes);
  return (
    <>
      {Object.keys(fetchClasses).length > 0 ? (
        <div className="absolute bg-white top-24 left-96 max-w-[1060px] p-10 rounded-xl shadow-2xl">
          <div className="flex flex-wrap gap-4">
            {Object.keys(fetchClasses).map((idx, index) => {
              const newClass = fetchClasses[idx];
              return (
                <div
                  key={index}
                  className="w-[150px] h-[70px] p-4 rounded-md shadow-md bg-slate-200 hover:border-b-2 border-black cursor-pointer"
                  onClick={() => handleClick(newClass)}
                >
                  <h2 className="text-lg font-semibold">{newClass.id}</h2>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-red-600 text-2xl">No Classes</p>
      )}
      <dialog id="modal" className="shadow-2xl rounded-lg">
        <div className="w-[850px] h-[550px]">
          <div className="flex justify-end p-4">
            <button onClick={() => document.getElementById("modal").close()}>
              X
            </button>
          </div>
          <div className="flex justify-between items-center px-10">
            <p> Class will start at {classes.ClassTiming}</p>
          </div>
          {fetchClasses && Object.keys(classes).length > 0 ? (
            <table className="table-auto m-5 w-[800px]">
              <thead>
                <tr className="bg-gray-900 text-white h-14">
                  <th className=" px-4 ">-</th>
                  <th>Name</th>
                  <th>Registration</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(classes).map((userId, index) => {
                  if (
                    userId !== "ClassTiming" &&
                    userId !== "ClassTeacherID" &&
                    userId !== "id"
                  ) {
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
            <p>No Student data available</p>
          )}
        </div>
      </dialog>
    </>
  );
};

export default TodayClasses;
