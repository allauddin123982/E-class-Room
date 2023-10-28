import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import tabs from "../../studentTabs.json";
import { useNavigate } from "react-router-dom";
import TodayClasses from "./TodayClasses";
import ClassJoin from "./ClassJoin";
import TimeTable from "./TimeTable";
import JoinedClass from "./JoinedClass";
import Chat from "./Chat";
import Home from "./Home";
// import { useGetUserInfo } from '../../hooks/useGetUserInfo'

const StudentDashBoard = () => {
  const navigate = useNavigate();
  const [titleName,setTitleName] = useState("home")
  const [userName, setUserName] = useState("");
  console.log({titleName})
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
    });
  }, []);
  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      navigate("/");
      console.log({ auth });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTab = (item) => {
    setTitleName(item.idd)
  }
  return (
    <>
    <div className="header bg-green-500 h-14">
      Update Profile
    </div>
      {userName ? <p className="mt-10 pb-5">Welcome {userName}</p> : null}
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen  transition-transform -translate-x-full  border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-2 overflow-y-auto bg-white ">
          <ul className="pt-16 space-y-4 font-medium text-left">
            {tabs.map((item,index) => (
              <li key={index}  onClick={() => {handleTab(item)}}>
                <p className="border-b flex items-center p-4 rounded-lg  hover:bg-gray-100 group">
                  <span className="ml-3" >{item.title}</span>
                </p>
              </li>
            ))}
          </ul>

          <button
            className="flex absolute pb-6 bottom-0 left-6 font-bold"
            onClick={signUserOut}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div>
        {
        titleName === "home" ? <Home/> : 
        titleName === "classes" ? <TodayClasses/> : 
        titleName === "timeTable" ? <TimeTable/> :
        titleName === "joinClass" ? <ClassJoin/>:
        titleName === "joindClasses" ? <JoinedClass/>:
        titleName === "chat" ? <Chat/>:
        null } 
      </div>
    </>
  );
};

export default StudentDashBoard;
