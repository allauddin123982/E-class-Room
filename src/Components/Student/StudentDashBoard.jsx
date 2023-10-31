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
import StudentProfile from "./StudentProfile";

const StudentDashBoard = () => {
  const navigate = useNavigate();
  const [titleName, setTitleName] = useState("home");
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
      console.log(userName)

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
    setTitleName(item.idd);
  };
  return (
    <>
      <div className="z-[-1] header bg-gray-200 w-full h-14 flex justify-between items-center  ">
        <p className="w-[50%]">
          {userName ? <p>Welcome {userName}</p> : null}
        </p>

        <button
          className="me-20"
          onClick={() => setProfile(!profile)}
        >
          Profile
        </button>
      </div>

      <aside
        className="fixed top-0 left-0 z-[-1] w-64 h-screen  transition-transform -translate-x-full  border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-2 overflow-y-auto bg-white ">
          <ul className="pt-16 space-y-4 font-medium text-left">
            {tabs.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  handleTab(item);
                  setProfile(false);
                }}
              >
                <p className="border-b flex items-center p-4 rounded-lg  hover:bg-gray-100 group">
                  <span className="ml-3">{item.title}</span>
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
        {profile ? <StudentProfile /> : null}
        {titleName === "home" && profile === false ? (
          <Home />
        ) : titleName === "classes" && profile === false ? (
          <TodayClasses />
        ) : titleName === "timeTable" && profile === false ? (
          <TimeTable />
        ) : titleName === "joinClass" && profile === false ? (
          <ClassJoin />
        ) : titleName === "joindClasses" && profile === false ? (
          <JoinedClass />
        ) : titleName === "chat" && profile === false ? (
          <Chat />
        ) : null}
      </div>
    </>
  );
};

export default StudentDashBoard;
