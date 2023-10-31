import React, { useEffect, useState } from "react";
import { useAddStdInfo } from "../../hooks/useAddStdInfo";
import {} from '../../hooks/useGetUserInfo'
const UpdateStudentProfile = ({ open, onClose }) => {
  const [file, setFile] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState("");
  const [reg, setReg] = useState();
  const [sem, setSem] = useState("");

  const { addStdInfo } = useAddStdInfo();

  const handleAdd = async (e) => {
    e.preventDefault();
    addStdInfo({name,reg,sem});
  };
  if (!open) return null;
  return (
    <>
      <div className="overlay bg-gray-300 bg-opacity-80 fixed w-[100%] h-[100%]">
        <div className="modalcontainer p-10 max-w-[700px] w-[100%] fixed flex gap-20 transform translate-x-[67%] translate-y-[30%] bg-white ">
          <div>
            <img
              src={selectedFile}
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
              <form className="p-2" onSubmit={handleAdd}>
                <div className="mt-2 flex flex-col items-start">
                  <p htmlFor="Name" className="">
                    Name
                  </p>
                  <input
                    id={"name"}
                    type="text"
                    className="border w-full"
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mt-2 flex flex-col items-start">
                  <p htmlFor="regno" className="">
                    Reg no
                  </p>
                  <input
                    id="reg"
                    type="text"
                    className="border w-full"
                    onChange={(e) => setReg(e.target.value)}
                    />
                </div>

                <div className="mt-2 flex flex-col items-start ">
                  <label htmlFor="semester">semester</label>
                  <input
                    id="sem"
                    type="text"
                    className="border w-full"
                    onChange={(e) => setSem(e.target.value)}
                    />
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
