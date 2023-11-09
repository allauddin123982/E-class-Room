import React, { useEffect, useState } from "react";
import UpdateStudentProfile from "./UpdateStudentProfile";
import AddStudentProfile from "./AddStudentProfile";
import { useGetstdInfo } from "../../hooks/useGetstdInfo";
const StudentProfile = () => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [buttonValue, setButtonValue] = useState(false);
  const { fetchData } = useGetstdInfo();
  useEffect(() => {
    if (fetchData && fetchData.length > 0) {
      setButtonValue(true);
    }
  }, [fetchData]);

  console.log("heelo");
  console.log({ fetchData });

 

  return (
    <div className="flex justify-center">
      <div className="modalcontainer p-10 max-w-[800px] w-[100%] fixed flex justify-center items-center gap-10 mt-20 bg-white ">
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
          <div className="w-[350px]">
            <form className="p-2 flex flex-col gap-y-10">
              <ul className="mt-2 flex items-start">
                {fetchData.map((student) => (
                  <li
                    key={student.id}
                    className="p-4 flex items-center gap-10  text-left"
                  >
                    <div className="w-[150px] h-[150px]">
                      <img
                        src={student.img}
                        alt="no img"
                        className="border-2 w-[150px] h-[150px] rounded-full object-fit"
                      />
                    </div>
                    <div className="w-[300px] flex flex-col gap-y-5 ">
                      <p className="">
                        <strong className="mr-14">Name:</strong> {student.namee}
                      </p>
                      <p className="">
                        <strong className="mr-[47px]">Reg no:</strong>
                        {student.reg}
                      </p>
                      <p className="">
                        <strong className="mr-[32px]">Semester:</strong>
                        {student.sem}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </form>
          </div>
        </div>
      </div>
      <UpdateStudentProfile
        open={updateOpenModal}
        onClose={() => setUpdateOpenModal(false)}
      />
      <AddStudentProfile
        open={addOpenModal}
        onClose={() => setAddOpenModal(false)}
      />
    </div>
  );
};

export default StudentProfile;
