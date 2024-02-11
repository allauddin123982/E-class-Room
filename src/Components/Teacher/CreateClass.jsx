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
  // const [classTimers, setClassTimers] = useState({});
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

  // Set up a global interval for checking notifications
  // useEffect(() => {
  //   const globalTimerId = setInterval(() => {
  //     // Iterate through each class and check notifications
  //     Object.keys(classTimers).forEach((classTime) => {
  //       notifyStudents(classTime);
  //     });
  //   }, 60000); // 60000 milliseconds = 1 minute

  //   // Clean up the global timer when the component is unmounted
  //   return () => {
  //     clearInterval(globalTimerId);
  //   };
  // }, [classTimers]);

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

  // Function to get 5 minutes before the class time
  // function getTimeBefore(timeString) {
  //   console.log("getTimeBefore");
  //   console.log("Original timeString:", timeString);

  //   const matchResult = timeString.match(/(\d+):(\d+)/);

  //   if (!matchResult) {
  //     // Handle the case where the timeString doesn't match the expected pattern
  //     console.error("Invalid time format:", timeString);
  //     return ""; // or some default value
  //   }

  //   const [hours, minutes] = matchResult.slice(1);

  //   // Convert to 24-hour format
  //   let hours24 = parseInt(hours, 10);

  //   // Set the time to the given hours and minutes
  //   const currentTime = new Date();
  //   currentTime.setHours(hours24, parseInt(minutes, 10));

  //   // Subtract 5 minutes
  //   currentTime.setMinutes(currentTime.getMinutes() - 5);

  //   // Format the result
  //   const resultHours = currentTime.getHours();
  //   const resultMinutes = currentTime.getMinutes();

  //   return `${resultHours.toString().padStart(2, "0")}:${resultMinutes
  //     .toString()
  //     .padStart(2, "0")}`;
  // }
  // Function to send a notification to a specific student
  // const sendNotificationToStudent = (student, notify) => {
  //   console.log("Time matched");
  //   let body = {
  //     to: student.messagingToken,
  //     notification: {
  //       title: "Class Notification ",
  //       body: `${student.namee} class is strting in 5 minutes, Be ready`,
  //     },
  //   };
  //   let options = {
  //     method: "POST",
  //     headers: new Headers({
  //       Authorization:
  //         "key=AAAAUAeZ2EI:APA91bGbkuvMeK_Fqo7Wfho1hmGL5fMABCnpoq_7JIBLDtDOqG0q2Z3YfDlfSuI7rhMO-oMYJ7Hl55qEDEsA_gGeSvxMi29FI2P6C7T8I5nsGbQLyysYPvGCht6vJ7CIkktWXHglh1Mp",
  //       "Content-Type": "application/json",
  //     }),
  //     body: JSON.stringify(body),
  //   };

  //   fetch("https://fcm.googleapis.com/fcm/send", options)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // const getCurrentTime = () => {
  //   const tdime = new Date();
  //   const hr = tdime.getHours();
  //   const min = tdime.getMinutes();
  //   return `${hr.toString().padStart(2, "0")}:${min
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  //Teacher createClass
  const createClass = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, `createClass/`, className);

      await setDoc(userDocRef, {
        ...stdList,
        // ClassTiming: classTime,
        ClassTeacherID:id //that current Teacher who created class
      });

      // Save the timer for the current class
      // setClassTimers((prevTimers) => ({
      //   ...prevTimers,
      //   [classTime]: true, // You can use any value to indicate that the timer is active
      // }));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to notify students 5 minutes before the class
  // const notifyStudents = (classTime) => {
  //   const timerIsActive = classTimers[classTime];

  //   if (timerIsActive) {
  //     // Calculate the notification time
  //     const notificationTime = getTimeBefore(classTime);

  //     const currTime = getCurrentTime();

  //     if (currTime === notificationTime) {
  //       // Notify each student
  //       stdList.forEach((student) => {
  //         sendNotificationToStudent(student, classTime);
  //       });

  //       // Deactivate the timer for this class after notifications are sent
  //       setClassTimers((prevTimers) => ({
  //         ...prevTimers,
  //         [classTime]: false,
  //       }));
  //     } else {
  //       console.log("Time did not match");
  //     }

  //     console.log("{notificationTime}");
  //     console.log({ notificationTime });
  //   }
  // };

  // searchStudentFunc by reg no
  const searchStudentFunc = () => {
    // console.log(takeName);
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

          {/* <input
            type="time"
            className="border p-1"
            onChange={(e) => {
              setClassTime(e.target.value);
            }}
          /> */}

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
                      checked={stdList.some(
                        (std) => std.uid === foundStudent.uid
                      )}
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
