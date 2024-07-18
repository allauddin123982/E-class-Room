import React, { useEffect, useState } from "react";
import tabs from "../../studentTabs.json";
import { useNavigate, useParams } from "react-router-dom";
import TodayClasses from "./TodayClasses";
import StudentProfile from "./StudentProfile";
import { signOut } from "firebase/auth";
import { auth, db, messaging } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { onMessage, getToken } from "firebase/messaging";
import { FaSignOutAlt } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import UploadNotes from "./UploadNotes";
import GroupChat from "./GroupChat";

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
        console.log("trigger", user);
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
        <p>Class reminder {notification.title}</p>
        <p>{notification.body}</p>
        <p>Class will start in 5 minutes</p>
      </div>
    );
  };

  // Function to update messaging token in Firestore
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
      });
      // console.log("new token generated ", token);
      // send this token to db
      updateMessagingTokenInFirestore(token);
    } else if (permission === "denied") {
      alert("You won't receive notifications");
    } else {
      console.log("Permission choice was not made");
    }
  }

  const onMessageListener = () => {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        console.log("On message payload", payload);
        resolve(payload);
      });
    });
  };

  useEffect(() => {
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
  }, []);

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser"); // Remove the item related to authentication
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleTab = (item) => {
    setTitleName(item.idd);
    setProfile(false); // Ensure profile is hidden when switching tabs
  };

  return (
    <>
      <div className="header bg-gray-200 w-full h-14 flex justify-between items-center">
        {userName && (
          <p className="ml-64 p-12 font-serif font-bold tracking-wider text-2xl">
            {userName.toUpperCase()} DASHBOARD
          </p>
        )}

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
        className="fixed top-0 left-0 w-64 h-screen transition-transform -translate-x-full border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-2 overflow-y-auto bg-white">
          <ul className="pt-16 space-y-4 font-medium text-left">
            {tabs.map((item, index) => (
              <li
                key={index}
                onClick={() => handleTab(item)}
                className="cursor-pointer"
              >
                <p className="border-b flex items-center p-4 rounded-lg hover:bg-gray-100 group">
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
        {profile ? (
          <StudentProfile />
        ) : (
          <>
            {titleName === "classes" && <TodayClasses />}
            {titleName === "groupChat" && <GroupChat />}
            {titleName === "manageNotes" && <UploadNotes />}
          </>
        )}
      </div>
    </>
  );
};

export default StudentDashBoard;
