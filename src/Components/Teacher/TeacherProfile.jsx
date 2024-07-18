import React, { useEffect, useState } from "react";
import AddTeacherProfile from "../Teacher/AddTeacherProfile";
import UpdateTeacherProfile from "./UpdateTeacherProfile";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";

const TeacherProfile = () => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  // const [imageUrl, setImageUrl] = useState("");
  const [buttonValue, setButtonValue] = useState(false);

  const { id } = useParams();

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
  }, [id]);
  
  useEffect(() => {
    if ("namee" in userData) {
      setButtonValue(true);
    } else {
      console.log("Object does not contain namee");
    }
  }, [userData]);
  console.log("check teacher dataa",  );
  return (
    <div className="flex justify-center">
      <div
        className="modalcontainer bg-white p-10 max-w-[800px] w-[100%] 
        fixed flex justify-center items-center gap-10 mt-20 shadow-2xl "
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
            <form className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-10 w-[500px] p-2">
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
                      <h1>Qualification: </h1>
                      <p>{userData.qua}</p>
                    </div>
                    <div className=" flex gap-x-10 p-4">
                      <h1>Designation: </h1>
                      <p>{userData.des}</p>
                    </div>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <UpdateTeacherProfile
        open={updateOpenModal}
        onClose={() => setUpdateOpenModal(false)}
        sendDataToUpdate={userData}
      />
      <AddTeacherProfile
        open={addOpenModal}
        onClose={() => setAddOpenModal(false)}
      />
    </div>
  );
};

export default TeacherProfile;
