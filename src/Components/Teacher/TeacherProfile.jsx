import React, { useEffect, useState } from 'react'
import AddTeacherProfile from '../Teacher/AddTeacherProfile';
import UpdateTeacherProfile from './UpdateTeacherProfile';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import { getDownloadURL, ref } from 'firebase/storage';
import { useParams } from 'react-router-dom';

const TeacherProfile = () => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
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
         
          if (userData && userData.img) {
            const storageRef = ref(storage, `teacher/${id}/`);
            const url = await getDownloadURL
            (storageRef);
            setImageUrl(url);
          }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTeacherData();
  }, []);
  console.log("check teacher dataa", userData)
  return (
    <div className="flex justify-center">
    <div className="modalcontainer p-10 max-w-[800px] w-[100%] fixed flex justify-center items-center gap-10 mt-20 bg-white ">
      <div className="modalRight">
        <div className="flex justify-end ml-52 w-[300px] ">
          {userData ? (
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
        <div className="w-[350px]">
          <form className="p-2 flex flex-col gap-y-10">
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
              </ul>
          </form>
        </div>
      </div>
    </div>
    <UpdateTeacherProfile
      open={updateOpenModal}
      onClose={() => setUpdateOpenModal(false)}
    />
    <AddTeacherProfile
      open={addOpenModal}
      onClose={() => setAddOpenModal(false)}
    />
  </div>
  )
}

export default TeacherProfile
