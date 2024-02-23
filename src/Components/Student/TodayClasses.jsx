import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
const TodayClasses = () => {
  const [fetchClasses, setFetchClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [seeStudents, setSeeStudents] = useState(false);
  const [classTeacherID, setClassTeacherID] = useState("");
  const [userData, setUserData] = useState({});
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

  useEffect(() => {
    setClassTeacherID(classes.ClassTeacherID);
  }, [classes]);

  //fetch Teacher to display that teacher scheduled a class
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Construct the document reference
        const userDocRef = doc(db, `teacherdata/${classTeacherID}/`);

        // Fetch the document
        const docSnapshot = await getDoc(userDocRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
          // Access the data using the data() method
          const teacherData = docSnapshot.data();
          setUserData(teacherData);

          // if (userData && userData.img) {
          //   const storageRef = ref(storage, `teacher/${id}/`);
          //   const url = await getDownloadURL(storageRef);
          //   setImageUrl(url);
          // }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTeacherData();
  }, [classTeacherID]);

  console.log("helo teaher ", userData);
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
                  <h2 className="text-lg font-semibold text-blue-500">
                    {newClass.id}
                  </h2>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-red-600 text-2xl">No Classes</p>
      )}

      <dialog id="modal" className="ml-72 rounded-lg w-[1200px] h-[660px]">
        <div className="header flex justify-between items-center m-2">
          <div className="flex gap-10 ">
            {/* check students button */}
            <div className="">
              <button
                className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={() => setSeeStudents(!seeStudents)}
              >
                Check Students
              </button>
            </div>
            {/* join class button */}
            <div className="">
              <button className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg">
                Join Class
              </button>
            </div>
          </div>
          {/* closing button */}
          <div className="p-4">
            <button onClick={() => document.getElementById("modal").close()}>
              X
            </button>
          </div>
        </div>

        {/* Teacher Schelduled classes  */}
        <div className="m-5 p-2 flex gap-x-5 ">
          <div>
            <img
              src={userData.img}
              alt="no img"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          {userData ? (
            <div className="border w-[600px]">
              <p className="text-xl font-bold text-left">{userData.namee}</p>
              <p className="text-left">Scheduled a class</p>
              <p className="pl-2 flex items-center gap-4 bg-blue-500 py-3 text-white">
                <p>
                  <SlCalender className="text-3xl font-extrabold" />
                </p>
                <div className="text-left text-md">
                  <p className="">{classes.ClassType}</p>
                  <span className="">{classes.ClassDate}</span> @{" "}
                  <span className="">{classes.ClassTiming}</span>
                </div>
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {seeStudents && fetchClasses && Object.keys(classes).length > 0 ? (
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
                  userId !== "id" &&
                  userId !== "ClassDate" &&
                  userId !== "ClassType"
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
        ) : null}
      </dialog>
    </>
  );
};

export default TodayClasses;
