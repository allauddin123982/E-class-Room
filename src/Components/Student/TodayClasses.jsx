import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db, storage } from "../../firebase-config";
import { useParams } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import VideoCall from "../videoCall";
import {
  getDownloadURL,
  list,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";

const TodayClasses = () => {
  const [fetchClasses, setFetchClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [seeStudents, setSeeStudents] = useState(false);
  const [classTeacherID, setClassTeacherID] = useState("");
  const [userData, setUserData] = useState({});
  const [inCall, setInCall] = useState(false);
  const [assignment, setAssignment] = useState([]);
  const [assignmentValue, setAssignmentValue] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);

  const { id } = useParams();

  let teacherIDs = fetchClasses.map((cls) => cls.ClassTeacherID);
  teacherIDs = teacherIDs.shift();
  const assigRef = ref(storage, `thrAssignments/${classes.id}/`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all classes
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
      
        // Find classes where at least one student has a matching uid
        let matchingClasses = data.filter((classObj) => {
          return Object.keys(classObj).some((key) => {
            const student = classObj[key];
            return student.uid === id;
          });
        });
        // Update state with the matched classes (or an empty array if no match)
        setFetchClasses(matchingClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]); 

  const handleClick = (className) => {
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

  //download teacher assignment
  useEffect(() => {
    listAll(assigRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          const fileName = item.name;
          setAssignment((prev) => [...prev, { url, fileName }]);
        });
      });
    });
    return () => {
      console.log("Component is unmounting. Cleanup tasks performed.");
    };
  }, [assignmentValue]);

  const downloadAssignment = () => {
    setAssignmentValue(!assignmentValue);
    const modal = document.getElementById("assignmentModal");
    modal.showModal();
  };

  //student uploading assignment
  const uploadAssignment = () => {
    if (assignmentFile === null) return;
    const fileRef = ref(storage,`stdAssignments/${classes.id}/${id}/${assignmentFile.name}`);
    uploadBytes(fileRef, assignmentFile).then(() => {
        alert("Uploaded");
        // Close the modal
        let closing = document.getElementById("modal3");
        closing.close();
      })
      .catch((error) => {
        console.error("Error uploading assignment:", error);
      });
  };

  const handleModelThree = () => {
    const modal = document.getElementById("modal3");
    modal.showModal();
  };

  const handleModalClose = () => {
    setAssignment([]);
    document.getElementById("assignmentModal").close();
  };
  // console.log("helo teaher ", students);

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
              {inCall ? (
                <VideoCall setInCall={setInCall} />
              ) : (
                <button
                  variant="contained"
                  className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                  onClick={() => setInCall(true)}
                >
                  Join Class
                </button>
              )}
            </div>

            {/* download assignment */}
            <div className="">
              <button
                variant="contained"
                className="w-[120px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={downloadAssignment}
              >
                Assignments
              </button>
            </div>

            {/* upload Assignment button */}
            <div className="">
              <button
                className="w-[100px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={handleModelThree}
              >
                Upload
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

      <dialog id="assignmentModal" className="rounded-lg w-[400px] h-[280px]">
        <div className="header bg-blue-500 flex justify-between items-center ">
          <p className="px-4 text-white font-bold tracking-wider">
            Assignments
          </p>
          {/* closing button */}
          <span className="p-4 text-white">
            <button onClick={handleModalClose}>X</button>
          </span>
        </div>
        <div className="p-4 text-lg ">
          <>
            <p className="">
              {assignment.length > 0 ? (
                assignment.map((url, index) => (
                  <>
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      download
                      className="flex items-center justify-between gap-10"
                    >
                      {`${url.fileName}`}
                      <IoCloudDownloadOutline />
                    </a>
                  </>
                ))
              ) : (
                <p>loading please wait</p>
              )}
            </p>
          </>
        </div>
      </dialog>

      {/* for assignment */}
      <dialog id="modal3" className="rounded-lg w-[400px] h-[210px]">
        <div className="header bg-blue-500 flex justify-between items-center text-white">
          <p className="px-4  font-bold tracking-wider">Upload Assignment</p>
          {/* closing button */}
          <span className="p-4">
            <button onClick={() => document.getElementById("modal3").close()}>
              X
            </button>
          </span>
        </div>
        <div className="p-4 text-lg ">
          <>
            <p className="flex gap-4">
              <label
                htmlFor="file"
                className="flex items-center gap-3 border p-1 cursor-pointer"
              >
                choose file <IoCloudUploadOutline />
              </label>
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={(e) => {
                  setAssignmentFile(e.target.files[0]);
                }}
              />
            </p>
            <br />
            <button
              className="w-[200px] bg-gray-200 p-1 rounded-lg hover:border border-black"
              onClick={uploadAssignment}
            >
              done
            </button>
          </>
        </div>
      </dialog>
    </>
  );
};

export default TodayClasses;
