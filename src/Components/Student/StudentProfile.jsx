import React, {  useState } from "react";
import UpdateStudentProfile from "./UpdateStudentProfile";
import { useGetstdInfo } from "../../hooks/useGetstdInfo";
const StudentProfile = () => {
  const [openModal, setOpenModal] = useState(false);
  const { fetchStdData } = useGetstdInfo();

  return (
    <div className="flex justify-center">
      <div className="modalcontainer p-10 max-w-[800px] w-[100%] fixed flex justify-center items-center gap-10 mt-20 bg-white ">
        <div className="">
          <img
            src=""
            alt=""
            className="border-4 w-[150px] h-[150px] rounded-full object-fit "
          />
        </div>
        <div className="modalRight">
          <div className="flex justify-end ">
            <button
              onClick={() => setOpenModal(true)}
              className="border p-1 rounded hover:bg-gray-200"
            >
              Update Profile
            </button>
          </div>
          <div className="w-[350px]">
            <form className="p-2 flex flex-col gap-y-10">
              <div className="mt-2 flex items-start">
                {fetchStdData.map((element) => {
                     const { name, reg, sem } =
                     element;
                  return (
                    <>
                      <p>{name}</p>
                      <p>{reg}</p>
                      <p>{sem}</p>
                    </>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </div>
      <UpdateStudentProfile
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default StudentProfile;
