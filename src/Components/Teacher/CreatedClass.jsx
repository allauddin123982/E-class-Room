import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { useParams } from "react-router-dom";
import VideoCall from "../videoCall";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState({});
  const [userData, setUserData] = useState({});
  const [classes, setClasses] = useState([]);
  const [settingDate, setSettingDate] = useState(false);
  const [seeStudents, setSeeStudents] = useState(false);
  const [classTime, setClassTime] = useState("");
  const [classDate, setClassDate] = useState("");
  const [classType, setClassType] = useState("");
  const [className, setClassName] = useState("");
  const [classTimers, setClassTimers] = useState({});
  const [stdList, setStdList] = useState([]);
  const [inCall, setInCall] = useState(false);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignment, setAssignment] = useState([]);
  const [assignmentValue, setAssignmentValue] = useState(false);
  
  const { id } = useParams();

  let newList = stdList.map((e) => ({ id: e.id, name: e.namee }));

  // Filter out undefined values
  newList = newList.filter((id) => id !== undefined);

  // Initialize an array to store assigRef for each stdID
  let assigRefs = [];
  let stdName = [];
  newList.forEach((stdID) => {
    const refPath = `stdAssignments/${className}/${stdID.id}`;

    stdName.push(stdID.name);
    const refInstance = ref(storage, refPath);
    assigRefs.push(refInstance);
  });

  useEffect(() => {
    const fetchCreatedClass = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let data = {};
        querySnapshot.forEach((doc) => {
          //return only those documents who matches with current teacher id
          const docData = doc.data();
          if (docData.ClassTeacherID === id) {
            data[doc.id] = docData;
          }
        });
        setCreatedClass(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCreatedClass();
  }, [id]);

  //open class
  const handleClick = (classSelected) => {
    setClassName(classSelected);
    const modal = document.getElementById("modal");
    modal.showModal();
    setClasses(createdClass[classSelected]);
  };
  //open model2
  const handleModelTwo = () => {
    const modal = document.getElementById("modal2");
    modal.showModal();
    setSettingDate(!settingDate);
  };
  const handleModelThree = () => {
    const modal = document.getElementById("modal3");
    modal.showModal();
  };
  useEffect(() => {
    const students = Object.values(classes);
    setStdList(students);
  }, [classes]);

  //Remove student from class
  const removeStudent = async (student) => {
    const studentIdToRemove = student.id;
  };

  // Set up a global interval for checking notifications
  useEffect(() => {
    const globalTimerId = setInterval(() => {
      // Iterate through each class and check notifications
      Object.keys(classTimers).forEach((classTime) => {
        notifyStudents(classTime);
      });
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the global timer when the component is unmounted
    return () => {
      clearInterval(globalTimerId);
    };
  }, [classTimers]);

  // Function to get 5 minutes before the class time
  function getTimeBefore(timeString) {
    console.log("getTimeBefore");
    console.log("Original timeString:", timeString);

    const matchResult = timeString.match(/(\d+):(\d+)/);

    if (!matchResult) {
      // Handle the case where the timeString doesn't match the expected pattern
      console.error("Invalid time format:", timeString);
      return ""; // or some default value
    }

    const [hours, minutes] = matchResult.slice(1);

    // Convert to 24-hour format
    let hours24 = parseInt(hours, 10);

    // Set the time to the given hours and minutes
    const currentTime = new Date();
    currentTime.setHours(hours24, parseInt(minutes, 10));

    // Subtract 5 minutes
    currentTime.setMinutes(currentTime.getMinutes() - 5);

    // Format the result
    const resultHours = currentTime.getHours();
    const resultMinutes = currentTime.getMinutes();

    return `${resultHours.toString().padStart(2, "0")}:${resultMinutes
      .toString()
      .padStart(2, "0")}`;
  }

  // Function to send a notification to a specific student
  const sendNotificationToStudent = (student, notify) => {
    console.log("Time matched");
    let body = {
      to: student.messagingToken,
      notification: {
        title: "Class Notification ",
        body: `${student.namee} class is strting in 5 minutes, Be ready`,
      },
    };
    let options = {
      method: "POST",
      headers: new Headers({
        Authorization:
          "key=AAAAUAeZ2EI:APA91bGbkuvMeK_Fqo7Wfho1hmGL5fMABCnpoq_7JIBLDtDOqG0q2Z3YfDlfSuI7rhMO-oMYJ7Hl55qEDEsA_gGeSvxMi29FI2P6C7T8I5nsGbQLyysYPvGCht6vJ7CIkktWXHglh1Mp",
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    };

    fetch("https://fcm.googleapis.com/fcm/send", options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const getCurrentTime = () => {
    console.log("getCurrentTime");
    const tdime = new Date();
    const hr = tdime.getHours();
    const min = tdime.getMinutes();
    return `${hr.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to notify students 5 minutes before the class
  const notifyStudents = (classTime) => {
    const timerIsActive = classTimers[classTime];

    if (timerIsActive) {
      // Calculate the notification time
      const notificationTime = getTimeBefore(classTime);

      const currTime = getCurrentTime();

      if (currTime === notificationTime) {
        // Notify each student
        stdList.forEach((student) => {
          sendNotificationToStudent(student, classTime);
        });

        // Deactivate the timer for this class after notifications are sent
        setClassTimers((prevTimers) => ({
          ...prevTimers,
          [classTime]: false,
        }));
      } else {
        console.log("Time did not match");
      }

      console.log("{notificationTime}");
      console.log({ notificationTime });
    }
  };

  const scheduleClass = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, `createClass/${className}/`);
      await setDoc(
        userDocRef,
        {
          ClassTiming: classTime,
          ClassDate: classDate,
          ClassType: classType,
        },
        { merge: true }
      );
      // Save the timer for the current class
      setClassTimers((prevTimers) => ({
        ...prevTimers,
        [classTime]: true, // You can use any value to indicate that the timer is active
      }));
      let closing = document.getElementById("modal3");
      closing.close();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadAssignment = () => {
    if (assignmentFile == null) return;
    const fileRef = ref(
      storage,
      `thrAssignments/${className}/${assignmentFile.name}`
    );
    uploadBytes(fileRef, assignmentFile).then(() => {
      alert("uploaded");
      let closing = document.getElementById("modal3");
      closing.close();
    });
  };

  // Download assignments for each reference
  useEffect(() => {
    // Create an array to store all download promises
    const downloadPromises = [];

    assigRefs.forEach((refInstance) => {
      const listPromise = listAll(refInstance).then((response) => {
        response.items.forEach((item) => {
          const downloadPromise = getDownloadURL(item).then((url) => {
            const fileName = item.name;
            let removedItem = stdName.shift();
            setAssignment((prev) => [...prev, { url, fileName, removedItem }]);
          });
          downloadPromises.push(downloadPromise);
        });
      });
      downloadPromises.push(listPromise);
    });

    // Wait for all download promises to resolve
    Promise.all(downloadPromises)
      .then(() => {
        console.log("All assignments downloaded successfully.");
      })
      .catch((error) => {
        console.error("Error downloading assignments:", error);
      });

    // Cleanup function
    return () => {
      console.log("Component is unmounting. Cleanup tasks performed.");
      // You may want to cancel ongoing download operations here
    };
  }, [assignmentValue]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Construct the document reference
        const userDocRef = doc(db, `teacherdata/${id}/`);

        // Fetch the document
        const docSnapshot = await getDoc(userDocRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
          // Access the data using the data() method
          const teacherData = docSnapshot.data();
          setUserData(teacherData);
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTeacherData();
  }, [id]);
  const downloadAssignment = () => {
    setAssignmentValue(!assignmentValue);
    const modal = document.getElementById("assignmentModal");
    modal.showModal();
  };
  const handleModalClose = () => {
    setAssignment([]);
    document.getElementById("assignmentModal").close();
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
                <h2 className="text-lg font-semibold text-blue-600">
                  {className}
                </h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-red-600 text-2xl">No classes</p>
      )}

      <dialog id="modal" className="ml-72 rounded-lg w-[1200px] h-[660px]">
        <div className="header flex justify-between items-center m-2">
          <div className="flex items-center gap-10 ">
            {/* schedule class button */}
            <div className="">
              <button
                className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={handleModelTwo}
              >
                Schedule Class
              </button>
            </div>

            {/* start class now button */}
            <div className="">
              {inCall ? (
                <VideoCall setInCall={setInCall} />
              ) : (
                <button
                  variant="contained"
                  className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                  onClick={() => {
                    setInCall(true);
                    
                  }}
                >
                  Start Class
                </button>
              )}
            </div>

            {/* check students button */}
            <div className="">
              <button
                className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={() => setSeeStudents(!seeStudents)}
              >
                Check Students
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
          </div>

          {/* closing button */}
          <div className="p-4">
            <button onClick={() => document.getElementById("modal").close()}>
              X
            </button>
          </div>
        </div>

        {/* students Table */}
        {seeStudents && classes && Object.keys(classes).length > 0 ? (
          <table className="table-auto m-5 w-[800px] border">
            <thead>
              <tr className="bg-gray-900 text-white h-14">
                <th className=" px-4 ">-</th>
                <th>Name</th>
                <th>Registration</th>
                <th>Semester</th>
                <th>Remove stds</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(classes).map((userId, index) => {
                if (
                  userId !== "ClassTiming" &&
                  userId !== "ClassTeacherID" &&
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
                      <td
                        className="cursor-pointer"
                        onClick={() => removeStudent(user)}
                      >
                        x
                      </td>
                    </tr>
                  );
                }

                return null; // Skip rendering for ClassTiming
              })}
            </tbody>
          </table>
        ) : null}
      </dialog>

      {/* for scheduling class */}
      <dialog id="modal2" className="rounded-lg w-[400px] h-[320px]">
        <div className="header bg-blue-500 flex justify-between items-center ">
          <p className="px-4 text-white font-bold tracking-wider">Schedule</p>
          {/* closing button */}
          <span className="p-4 text-white">
            <button onClick={() => document.getElementById("modal2").close()}>
              X
            </button>
          </span>
        </div>
        <div className="p-4 text-lg ">
          {settingDate ? (
            <>
              <p className="flex gap-4">
                Add a title :
                <input
                  type="text"
                  onChange={(e) => {
                    setClassType(e.target.value);
                  }}
                  className="border"
                />
              </p>
              <br />
              <p className="flex gap-4">
                Date:
                <input
                  type="date"
                  onChange={(e) => {
                    setClassDate(e.target.value);
                  }}
                />
              </p>
              <br />
              <p className="flex gap-4">
                Time:
                <input
                  type="time"
                  onChange={(e) => {
                    setClassTime(e.target.value);
                  }}
                />
              </p>
              <br />
              <button
                className="w-[200px] bg-gray-200 p-1 rounded-lg hover:border border-black"
                onClick={scheduleClass}
              >
                done
              </button>
            </>
          ) : null}
        </div>
      </dialog>

      {/* for assignment select file */}
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

      {/* downloaded assignments */}
      <dialog id="assignmentModal" className="rounded-lg w-[650px] h-[500px]">
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
            {assignment.length > 0 ? (
              <table className="border w-[600px]">
                <thead>
                  <tr className="border">
                    <th className="border">#</th>
                    <th className="border">Name</th>
                    <th>Assignment</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.map((item, index) => (

                    <tr key={index} className="p-20 border">
                    <td className="p-4 border" >{index+1}</td>
                      <td className="p-4 border">
                        <p>
                          {`${item.removedItem}`}
                        </p>
                      </td>
                      <td className="p-4 ">
                        <a
                          href={item.url}
                          target="_blank"
                          download
                          className="flex items-center justify-between gap-4"
                        >
                          {`${item.fileName}`}
                          <IoCloudDownloadOutline />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ):<p>No Assignments</p>}
          </>
        </div>
      </dialog>
    </>
  );
};

export default CreatedClass;
