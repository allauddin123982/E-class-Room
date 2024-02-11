import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";

const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState({});
  const [classes, setClasses] = useState([]);
  const [settingDate, setSettingDate] = useState(false);
  const [classTime, setClassTime] = useState("");
  const [className, setClassName] = useState("");
  const [classTimers, setClassTimers] = useState({});
  const [stdList, setStdList] = useState([]);
  
  const { id } = useParams();

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
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }

    // Save the timer for the current class
    setClassTimers((prevTimers) => ({
      ...prevTimers,
      [classTime]: true, // You can use any value to indicate that the timer is active
    }));
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
            <div>
              <p
                className="w-[150px] hover:cursor-pointer bg-gray-200 p-1 rounded-lg"
                onClick={() => setSettingDate(!settingDate)}
              >
                Schedule Class
              </p>
              {settingDate ? (
                <p className="mt-2">
                  <input
                    type="time"
                    onChange={(e) => {
                      setClassTime(e.target.value);
                    }}
                  />
                  <button
                    className=" bg-gray-200 p-1 rounded-lg hover:border border-black"
                    onClick={scheduleClass}
                  >
                    done
                  </button>
                </p>
              ) : null}
            </div>
            {/* <p> Class will start at {classes.ClassTiming}</p> */}
          </div>
          {classes && Object.keys(classes).length > 0 ? (
            <table className="table-auto m-5 w-[800px]">
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
                  if (userId !== "ClassTiming" && userId !== "ClassTeacherID") {
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
          ) : (
            <p>No user data available</p>
          )}
        </div>
      </dialog>
    </>
  );
};

export default CreatedClass;
