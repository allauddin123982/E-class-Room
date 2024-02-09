import React, { useContext, useEffect, useState } from "react";
import UpdateStudentProfile from "./UpdateStudentProfile";
import AddStudentProfile from "./AddStudentProfile";
import { db, storage } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";

const StudentProfile = () => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [buttonValue, setButtonValue] = useState(false);
  const { id } = useParams();
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Construct the document reference
        const userDocRef = doc(db, `studentdata/${id}/`);

        // Fetch the document
        const docSnapshot = await getDoc(userDocRef);

        // Check if the document exists
        if (docSnapshot.exists()) {
          // Access the data using the data() method
          const userData = docSnapshot.data();
          setUserData(userData);
          if (userData && userData.img) {
            const storageRef = ref(storage, `student/${id}/`);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
          }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchStudentData();
  }, []);
  
  useEffect(() => {
    if ("namee" in userData) {
      setButtonValue(true);
    } else {
      console.log("Object does not contain namee");
    }
  }, [userData]);
  console.log(userData);
  return (
    <>
      <div className="flex justify-center bg-green-400 ">
        <div
          className="modalcontainer bg-white rounded p-10 max-w-[800px] w-[100%] 
        fixed flex justify-center items-center gap-10 mt-20 shadow-2xl"
        >
          <div className="modalRight">
            <div className="flex justify-end ml-52 w-[300px] ">
              {buttonValue ? (
                <button
                  onClick={() => {
                    setUpdateOpenModal(true);
                  }}
                  className="border p-1 rounded hover:bg-gray-200"
                >
                  Update Profile
                </button>
              ) : (
                <button
                  onClick={() => setAddOpenModal(true)}
                  className="border p-1 rounded hover:bg-gray-200"
                >
                  Add Profile
                </button>
              )}
            </div>
            <div className="w-[350px] ">
              <form>
                <ul className="mt-2 flex items-center gap-x-10 w-[500px]">
                  <img
                    src={userData.img}
                    alt="no img"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                  {userData ? (
                    <div>
                      <div className=" flex gap-x-10 p-4">
                        <h1>Name:</h1>
                        <p>{userData.namee}</p>
                      </div>
                      <div className=" flex gap-x-10 p-4">
                        <h1>Reg no: </h1>
                        <p>{userData.reg}</p>
                      </div>
                      <div className=" flex gap-x-10 p-4">
                        <h1>Semester: </h1>
                        <p>{userData.sem}</p>
                      </div>
                    </div>
                  ) : (
                    <p>Loading...</p>
                  )}
                </ul>
              </form>
            </div>
          </div>
        </div>
        <AddStudentProfile
          open={addOpenModal}
          onClose={() => setAddOpenModal(false)}
        />
        <UpdateStudentProfile
          sendDataToUpdate={userData}
          open={updateOpenModal}
          onClose={() => setUpdateOpenModal(false)}
        />
      </div>
    </>
  );
};
export default StudentProfile;