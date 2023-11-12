import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {useGetThrInfo} from '../../hooks/useGetThrInfo'
const AddTeacherProfile = ({ open, onClose }) => {
   const [data, setData] = useState({});
  const [file, setFile] = useState("");
  const [isDataStored, setIsDataStored] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  const { id } = useParams();
  const { fetchThrData } = useGetThrInfo();
  
  // useEffect(() => {
  //   if (fetchThrData) {
  //     // Data is already stored for this user
  //     setData(fetchThrData); // Set the initial form data to the fetched data
  //     setIsDataStored(true);
  //   }
  // }, [fetchThrData]);

  useEffect(() => {
    const uploadFile = () => {
      // const name = new Date().getTime() + file.name;
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

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Generate a URL for the selected image and update the <img> tag
      setSelectedImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = (e) => {
    const idd = e.target.id;
    const value = e.target.value;
    setData({ ...data, [idd]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      const res = await addDoc(
        collection(db, `teacherdata/${id}/subcollection`),
        {
          ...data,
          timeStamp: serverTimestamp(),
        }
      );
      setData({
        namee: "",
        qua: "",
        des: "",
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  if (!open) return null;
  return (
    <div className="overlay bg-gray-300 bg-opacity-80 fixed w-[100%] h-[100%]">
      <div className="modalcontainer p-10 max-w-[700px] w-[100%] fixed flex gap-20 transform translate-x-[67%] translate-y-[30%] bg-white ">
        <div>
          <img
            src={selectedImageUrl}
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
            onChange={handleImageSelect}
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
            <h1 className="text-2xl">Add Profile</h1>
            <form className="p-2" onSubmit={handleAdd}>
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
  );
};

export default AddTeacherProfile;
