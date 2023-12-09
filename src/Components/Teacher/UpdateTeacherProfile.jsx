import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const UpdateTeacherProfile = ({ open, onClose }) => {
  const [data, setData] = useState({});
  const [file, setFile] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, `teacherdata/${id}/`);
      const docSnapshot = await getDoc(userDocRef);
     
      if (docSnapshot.exists()) {
        const updatedData = {
          ...data,
        };

        // Update the document with the new data
        await updateDoc(doc(db, `teacherdata/${id}/`), updatedData);

        setData({
          namee: "",
          qua: "",
          des: "",
        });

        onClose();
      } else {
        console.log("No matching document found.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!open) return null;
  return (
    <>
      <div className="overlay bg-gray-300 bg-opacity-80 fixed w-[100%] h-[100%]">
        <div className="modalcontainer p-10 max-w-[700px] w-[100%] fixed flex gap-20 transform translate-x-[67%] translate-y-[30%] bg-white ">
          <div>
            <img
              src={data.img }
              alt=""
              className="border-4 w-[150px] h-[150px] mt-4 rounded-full object-fit "
            />
            <label htmlFor="file" className="hover:cursor-pointer">
              Image
            </label>
            <input
              id="file"
              type="file"
              className="pt-2 hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="modalRight">
            <p
              onClick={onClose}
              className="closeBtn fixed top-4 right-6 hover:cursor-pointer"
            >
              x
            </p>
            <div className="border mt-3 bg-gray-100  w-[350px] ">
              <h1 className="text-2xl">Update Profile</h1>
              <form className="p-2" onSubmit={handleUpdate}>
                <div className="mt-2 flex flex-col items-start">
                  <p htmlFor="Name" className="">
                    Name
                  </p>
                  <input
                    id="namee"
                    type="text"
                    value={data.namee}
                    className="border w-full ps-1"
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-2 flex flex-col items-start">
                  <p htmlFor="Qualification" className="">
                    Qualification
                  </p>
                  <input
                    id="qua"
                    type="text"
                    value={data.qua}
                    className="border w-full ps-1"
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-2 flex flex-col items-start ">
                  <label htmlFor="Designation">Designation</label>
                  <input
                    id="des"
                    type="text"
                    value={data.des}
                    className="border w-full ps-1"
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4 flex flex-col items-start">
                  <button type="submit" className="border p-1 hover:bg-white">
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

export default UpdateTeacherProfile;
