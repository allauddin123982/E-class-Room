import React, { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";

const UpdateStudentProfile = ({ open, onClose, setButtonValue }) => {
  const [data, setData] = useState({});
  const [file, setFile] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  // const [buttonVal, setButtonVal] = useState(false);
  const { id } = useParams();

  //Image set and Upload

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
      setSelectedImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = ({ target }) => {
    const { id, value } = target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, `studentdata/${id}/`);

      // Use setDoc to update the existing document
      await setDoc(
        userDocRef,
        {
          ...data,
          timeStamp: serverTimestamp(),
        },
        { merge: true }
      );
      setData({
        namee: "",
        reg: "",
        sem: "",
      });
      // setButtonValue(true)
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!open) return null;
  return (
    <>
      <div className="overlay bg-gray-300 bg-opacity-80 fixed w-[100%] h-[100%]">
        <div className="modalcontainer p-10 max-w-[700px] w-[100%] fixed flex gap-20 transform translate-x-[67%] translate-y-[10%] bg-white ">
          <div className="modalRight">
            <p
              onClick={onClose}
              className="closeBtn fixed top-4 right-6 hover:cursor-pointer"
            >
              x
            </p>
            <div className="border w-[550px] mt-3 bg-gray-100">
              <h1 className="text-2xl">Add Profile</h1>
              <form className="p-2 flex gap-x-10" onSubmit={handleAdd}>
                <div className="w-[200px] flex flex-col items-center">
                  <img
                    src={selectedImageUrl}
                    alt=""
                    className="border border-gray-500 w-[150px] h-[150px] mt-4 rounded-full object-fit "
                  />
                  <label htmlFor="file" className="hover:cursor-pointer">
                    Image
                  </label>

                  <input
                    id="file"
                    type="file"
                    className="pt-2 hidden"
                    onChange={(e) => {
                      handleImageSelect(e);
                      setFile(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="w-[300px]">
                  <div className="mt-2 flex flex-col items-start ">
                    <label htmlFor="namee">Name</label>
                    <input
                      id="namee"
                      type="text"
                      value={data.namee}
                      className="border w-full ps-1"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <label htmlFor="reg">Reg no</label>
                    <input
                      id="reg"
                      type="text"
                      value={data.reg}
                      className="border w-full ps-1"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-2 flex flex-col items-start">
                    <label htmlFor="sem">Semester</label>
                    <input
                      id="sem"
                      type="text"
                      value={data.sem}
                      className="border w-full ps-1"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mt-4 flex flex-col items-start">
                    <button type="submit" className="border p-1 hover:bg-white">
                      Submit
                    </button>
                  </div>
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
