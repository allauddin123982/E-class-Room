import React, { useEffect, useState } from "react";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import tabs from "../../TeacherTabs.json";
import TeacherProfile from "./TeacherProfile";
import CreateClass from "./CreateClass";
import Home from "./Home"
import CreatedClass from "./CreatedClass";

const TeacherDashBoard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(false);
  const [titleName, setTitleName] = useState("home");
  const [userName, setUserName] = useState("");

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
    setTitleName(item.idd);
  };

  return (
    <div>
      <div className="z-[-1] header bg-gray-200 w-full h-14 flex justify-between items-center">
        {userName ? (
          <p className="ms-64 font-serif font-bold tracking-wider text-2xl">
            {userName} Dashboard
          </p>
        ) : null}

        <div
          className="flex gap-1 me-10 hover:cursor-pointer"
          onClick={() => setProfile(!profile)}
        >
          <button className="font-serif font-bold">Profile</button>
          {/* <img
            src={}
            alt="no img"
            className="border-2 w-[40px] h-[40px]  rounded-full object-fit"
          /> */}
        </div>
      </div>
      <aside
        className="fixed top-0 left-0 z-[-1] w-64 h-screen  transition-transform -translate-x-full  border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 "
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
        {profile ? <TeacherProfile /> : null}
        {titleName === "home" && profile === false ? (
          <Home />
        ) : titleName === "createClass" && profile === false ? (
          <CreateClass />
        ) : titleName === "createdClass" && profile === false ? (
          <CreatedClass /> )
        // ) : titleName === "joinClass" && profile === false ? (
        //   <ClassJoin />
        // ) : titleName === "joindClasses" && profile === false ? (
        //   <JoinedClass />
        // ) : titleName === "chat" && profile === false ? (
        //   <Chat />
        // )
        : null}
      </div>
      <button
        className="flex absolute pb-6 bottom-0 left-6 font-bold"
        onClick={signUserOut}
      >
        Sign out
      </button>
      {profile ? <TeacherProfile /> : null}
    </div>
  );
};

export default TeacherDashBoard;
