import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { getMessaging } from "firebase/messaging";
const CreateClass = () => {
  const [fetchStudentData, setFetchStudentData] = useState([]);
  const [className, setClassName] = useState("");
  const [classTime, setClassTime] = useState("");
  const [stdList, setStdList] = useState([]);
  const [classTimers, setClassTimers] = useState({});

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
    console.error("Error fetching data:", fetchStudentData);
  }, []);

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
  // Function to send a notification to a specific student
const sendNotificationToStudent = (student, notify) => {
  console.log(student.namee);
  console.log(student.messagingToken);
  console.log("5 minutes before");

  try {
    if (student.messagingToken) {
      // Create a notification
      new Notification(`Class Reminder`, {
        body: `Your class is starting in 5 minutes at ${notify}. Be ready!`,
      });
    } else {
      console.error(
        "Messaging token not available for student:",
        student.namee
      );
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};


  const getCurrentTime = () => {
    const tdime = new Date();
    const hr = tdime.getHours();
    const min = tdime.getMinutes();
    return `${hr.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  };

  const createClass = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "createClass", className);

      await setDoc(userDocRef, {
        ...stdList,
        ClassTiming: classTime,
      });

      // Save the timer for the current class
      setClassTimers((prevTimers) => ({
        ...prevTimers,
        [classTime]: true, // You can use any value to indicate that the timer is active
      }));
    } catch (error) {
      console.error(error);
    }
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

  return (
    <>
      <div className="absolute bg-white top-24 left-96 w-[550px] p-4 rounded-xl shadow-xl">
        <div className="flex gap-x-2">
          <input
            type="text"
            className="border p-1"
            placeholder="Class name"
            onChange={(e) => setClassName(e.target.value)}
          />

          <input
            type="time"
            className="border p-1"
            // placeholder="12:00 AM"
            onChange={(e) => {
              setClassTime(e.target.value);
            }}
          />
          <button
            className="border p-1 bg-gray-200 w-[80px] font-semibold rounded-lg hover:border hover:border-black"
            onClick={createClass}
          >
            Create
          </button>
        </div>
        <table className="table w-[500px] mt-4">
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
            {fetchStudentData.map((element, index) => (
              <tr key={index} className=" hover:bg-gray-100 transition-all">
                <td className="p-2 flex justify-center">
                  <p>
                    <img
                      src={element.img}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </p>
                </td>
                <td>{element.namee}</td>
                <td>{element.reg}</td>
                <td>{element.sem}</td>

                <td>
                  <input
                    type="checkbox"
                    checked={stdList.some((std) => std.uid === element.uid)} //5
                    onChange={() => addStdInClass(element)} //1
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
