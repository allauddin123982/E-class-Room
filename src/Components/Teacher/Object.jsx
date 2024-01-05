import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

const CreatedClass = () => {
  const [createdClass, setCreatedClass] = useState([]);
  const [classes, setClasses] = useState();
// Function to check if it's time to send a notification
  // const sendNotification = () => {
  //   const currentTime = getCurrentTime();

  //   // Extract hours and minutes from the time strings
  //   const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
  //   const [notificationHours, notificationMinutes] = notificationTime
  //     .split(":")
  //     .map(Number);

  //   // Calculate the time difference in minutes
  //   const timeDifference =
  //     (currentHours - notificationHours) * 60 +
  //     (currentMinutes - notificationMinutes);

  //   if (timeDifference >= 0 && timeDifference <= 5) {
  //     console.log("Time to send notification");
  //     // Call the function to send a notification to students
  //   } else {
  //     console.log("Not time yet");
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all classes
        const querySnapshot = await getDocs(collection(db, "createClass"));
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        //fetched all classes
        console.log("data : ", data);

        // Find the class where at least one student has a matching uid
        let matchingClass = Object.keys(data).map((classObj) => {
          const user = data[classObj];
          // console.log("each class ",user)
          let matchingClass2 = Object.keys(user).map((idx) => {
            if (idx !== "ClassTiming" && idx !== "ClassTeacherID") {
              const user2 = user[idx];
              if(user2.uid === iddd){
                setFetchClasses(user2);
              }
              // console.log("inside student uid", user2.uid)
            }
          });
        });
        // console.log("matchingClass ", matchingClass);
        // Update state with the matched class (or null if no match)
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function here
  }, []); // Make sure to include 'id' in the dependency array




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

  const handleClick = (element) => {
    const modal = document.getElementById("modal");
    modal.showModal();
    setClasses(element);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!values.email || !values.password || !values.role) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setSubmitButtonDisabled(true);
    const res = await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        // const user = res.user;
        // console.log({ user });
        
        await updateProfile(res.user, {
          displayName: values.role, //set user name
        });
      
        if(values.role === 'student'){

          await setDoc(doc(db, "studentdata", res.user.uid), {
            uid: res.user.uid,
            email: values.email,
            role: values.role,
            // fcmToken:
            // Add more fields as needed
          });
        }else {
            await setDoc(doc(db, "teacherdata", res.user.uid), {
              uid: res.user.uid,
              email: values.email,
              role: values.role,
              // Add more fields as needed
            });
          }
  
          navigate("/login");
        })
      .catch((err) => {
          setSubmitButtonDisabled(false);
          setError(err.message);
        });
    };
  



  console.log({classes});
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
            {/* <div>
              <p>Name: {classes.namee}</p>
              <p>Registration: {classes.reg}</p>
              <p>Semester: {classes.sem}</p>
            </div> */}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreatedClass;
