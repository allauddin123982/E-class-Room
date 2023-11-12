import React, { useState,useEffect } from 'react'
import AddTeacherProfile from '../Teacher/AddTeacherProfile';
import UpdateTeacherProfile from './UpdateTeacherProfile';
import { useGetThrInfo } from '../../hooks/useGetThrInfo';

const TeacherProfile = () => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [buttonValue, setButtonValue] = useState(false);
  const { fetchThrData } = useGetThrInfo();
  
  useEffect(() => {
    if (fetchThrData && fetchThrData.length > 0) {
      setButtonValue(true);
    }
  }, [fetchThrData]);

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
              {fetchThrData.map((teacher) => (
                <li
                  key={teacher.id}
                  className="p-4 flex items-center gap-10  text-left"
                >
                  <div className="w-[150px] h-[150px]">
                    <img
                      src={teacher.img}
                      alt="no img"
                      className="border-2 w-[150px] h-[150px] rounded-full object-fit"
                    />
                  </div>
                  <div className="w-[300px] flex flex-col gap-y-5 ">
                    <p className="">
                      <strong className="mr-24">Name:</strong> {teacher.namee}
                    </p>
                    <p className="">
                      <strong className="mr-[48px]">Qualification:</strong>
                      {teacher.qua}
                    </p>
                    <p className="">
                      <strong className="mr-[54px]">Designation:</strong>
                      {teacher.des}
                    </p>
                  </div>
                </li>
              ))}
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
