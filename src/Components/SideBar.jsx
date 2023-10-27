import React from "react";
import tabs from "../sidetabs.json";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
const SideBar = () => {
  const { name, profilePhoto } = useGetUserInfo();
  return (
    <>
      
      

      {/* <div className=" flex flex-col justify-center items-center  border-black mt-28 w-[270px]">
            <img src={profilePhoto} alt="hello" className="w-[140px] rounded-full "/>
            <p className="text-green-500">{name}</p>

          </div> */}
      {/* <div className="mt-5 p-2 flex flex-col gap-y-2">
            {tabs.map((item) => (
              <div className=" hover:bg-gray-200 hover:text-black transition-all duration-100 ease-in-out p-3  rounded-lg">
                <span className="uppercase font-normal">
                  {item.title.charAt(0)}
                </span>
                {item.title.slice(1)}
              </div>
            ))}
          </div> */}
    </>
  );
};

export default SideBar;
