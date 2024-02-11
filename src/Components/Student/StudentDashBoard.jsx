import React, { useEffect, useState } from "react";
import tabs from "../../studentTabs.json";
import { useNavigate, useParams } from "react-router-dom";
import TodayClasses from "./TodayClasses";
import ClassJoin from "./ClassJoin";
import TimeTable from "./TimeTable";
import Chat from "./Chat";
import StudentProfile from "./StudentProfile";
import { signOut } from "firebase/auth";
import { auth, db, messaging } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { onMessage, getToken } from "firebase/messaging";
import { FaSignOutAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";

const StudentDashBoard = () => {
  const navigate = useNavigate();
  const [titleName, setTitleName] = useState("classes");
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const { id } = useParams();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName(null);
      }
    });
  }, []);

  useEffect(() => {
    if (notification?.title) {
      DisplayNotification();
    }
  }, [notification]);

  const DisplayNotification = () => {
    return (
      <div>
        <p>Class remainder {notification.title}</p>
        <p>{notification.body}</p>
        <p>class will start in 5m</p>
      </div>
    );
  };
  //Function to update messaging token in Firestore
  const updateMessagingTokenInFirestore = async (messagingToken) => {
    const studentDocRef = doc(db, `studentdata/${id}/`);

    // Update the messagingToken field in the Firestore document
    await setDoc(studentDocRef, { messagingToken }, { merge: true });
  };

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BFaf75xsqzjUBEtqQH8rueELJaV2g_1zC6lxvl5WG_0FcKeEuAfXDPcDbq0Xdxqzjtqj6FTBrx_RXGgTqnp_Kt8",
      }); // Create a notification
      // console.log("new token generated ", token);
      //send this token to db
      updateMessagingTokenInFirestore(token);
    } else if (permission === "denied") {
      alert("you won't get Notification");
    } else {
      console.log("chose nothing");
    }
  }
  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("on message payload", payload);
        resolve(payload);
      });
    });
  };

  requestPermission();
  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification.title,
        body: payload?.notification.body,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("auth");
      navigate("/");
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
        {userName ? (
          <p className="ms-64 font-serif font-bold tracking-wider text-2xl">
            {userName} Dashboard
          </p>
        ) : null}

        <div
          className="flex gap-1 me-10 hover:cursor-pointer"
          onClick={() => setProfile(!profile)}
        >
          <button className="font-bold text-2xl">
            <IoPersonOutline />
          </button>
        </div>
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
                className="cursor-pointer"
              >
                <p className="border-b flex items-center p-4 rounded-lg  hover:bg-gray-100 group">
                  <span className="ml-3">{item.title}</span>
                </p>
              </li>
            ))}
          </ul>

          <button
            className="flex items-center gap-x-1 absolute pb-6 bottom-0 left-6 font-bold"
            onClick={signUserOut}
          >
            <FaSignOutAlt />
            Sign out
          </button>
        </div>
      </aside>

      <div>
        {profile ? <StudentProfile /> : null}
        {titleName === "classes" && profile === false ? (
          <TodayClasses />
        ) : titleName === "timeTable" && profile === false ? (
          <TimeTable />
        ) : titleName === "joinClass" && profile === false ? (
          <ClassJoin />
        ) : titleName === "chat" && profile === false ? (
          <Chat />
        ) : null}
      </div>
    </>
  );
};

export default StudentDashBoard;
