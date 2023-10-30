import React, { useState } from "react";
import { db } from "../../firebase-config";
import { addDoc, collection } from "firebase/firestore";
// import profilePic from "../../Images/profilepic.png";
const UpdateStudentProfile = ({ open, onClose }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
  const [studentData, setStudentData] = useState({});
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       setSelectedFile(fileURL);
//     } else {
//       setSelectedFile(null);
//     }
//   };
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setStudentData({...studentData, [id]:value});
    console.log(studentData)
  }
  const handleAdd = async(e) => {
    e.preventDefault();
    
    const res = await addDoc(collection(db, "studentdata"), {
        ...studentData,
      });
      console.log(res.id)
  }
  if (!open) return null;
  return (
    <>
      <div className="overlay bg-gray-300 bg-opacity-80 fixed w-[100%] h-[100%]">
        <div className="modalcontainer p-10 max-w-[700px] w-[100%] fixed flex transform translate-x-[67%] translate-y-[30%] bg-white ">
          <div>
            <img
              src=""
              alt=""
              className="border-4 w-[150px] h-[150px] rounded-full object-fit "
            />
            <input id={"pic"} type="file" className="pt-2" onChange={handleInput} />
          </div>
          <div className="modalRight">
            <p onClick={onClose} className="closeBtn fixed top-4 right-6 hover:cursor-pointer">
              x
            </p>
              <div className="border bg-gray-100  w-[350px] ">
                <h1 className="text-2xl">Update Profile</h1>
                <form className="p-2" onSubmit={handleAdd}>
                  <div className="mt-2 flex flex-col items-start">
                    <p htmlFor="Name" className="">
                      Name
                    </p>
                    <input id={"name"} type="text" className="border w-full" onChange={handleInput} />
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <p htmlFor="regno" className="">
                      Reg no
                    </p>
                    <input id="reg" type="text" className="border w-full" onChange={handleInput}/>
                  </div>

                  <div className="mt-2 flex flex-col items-start ">
                    <label htmlFor="semester">semester</label>
                    <input id="sem" type="text" className="border w-full" onChange={handleInput}/>
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <button type="submit" className="border p-1">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStudentProfile;
