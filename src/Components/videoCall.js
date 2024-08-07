import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "../setting.js";
import AgoraRTC from "agora-rtc-sdk-ng"; // Import AgoraRTC
import { videoCallDom } from "./videoCallDom.js";
import { FaMicrophone } from "react-icons/fa6";
import { IoIosMicOff } from "react-icons/io";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { TbScreenShare } from "react-icons/tb";
import { TbScreenShareOff } from "react-icons/tb";
import { IoMdExit } from "react-icons/io";
import { db } from "../firebase-config.js";
import { doc, getDoc } from "firebase/firestore";
import "./videoCall.css";
import { useParams } from "react-router-dom";

export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [timer, setTimer] = useState(0);
  const [screenShare, setScreenShare] = useState(true);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const client = useClient();
  const currentUser = localStorage.getItem("currentUser");
  let { expandVideoFrame, displayFrame, userIdInDisplayFrame } = videoCallDom();
  const { id } = useParams();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  let uid = sessionStorage.getItem("uid");

  if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem("uid", uid);
  }
  let remoteUsers = {};
  let localScreenTracks;
  let sharingScreen = false;

  useEffect(() => {
    videoCallDom();
  }, []);

  const handleExpandVideoClick = (e) => {
    expandVideoFrame(e);
  };

  const fetchUserName = async (userId) => {
    try {
      if (!userId) return;
      let userDocRef = doc(db, `studentdata/${userId}`);
      let userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data().namee; // Assuming 'namee' is the field in your document
      }

      userDocRef = doc(db, `teacherdata/${userId}`);
      userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data().namee; // Assuming 'namee' is the field in your document
      }

      return "Unknown User";
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let joinRoomInit = async (name) => {
      try {
        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio" && user.audioTrack) user.audioTrack.stop();
          if (mediaType === "video") {
            setUsers((prevUsers) =>
              prevUsers.filter((User) => User.uid !== user.uid)
            );
          }
        });

        await client.join(config.appId, name, config.token, config.uid);
        client.on("user-published", handleUserPublished);
        client.on("user-left", handleUserLeft);
        joinStream();
        setStart(true);
      } catch (error) {
        console.error("Error initializing video call:", error);
      }
    };

    let joinStream = async () => {
      const userName = await fetchUserName(id);
      let player = `
      <div>
        <div class="video__container" id="user-container-${uid}">
          <div class="video-player" id="user-${uid}"></div>
        </div>
        <div class="user-name">${userName}</div>
      </div>
      `;

      document
        .getElementById("streams__container")
        .insertAdjacentHTML("beforeend", player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", handleExpandVideoClick);

      tracks[1].play(`user-${uid}`);
      await client.publish([tracks[0], tracks[1]]);
    };

    let handleUserPublished = async (user, mediaType) => {
      remoteUsers[user.uid] = user;
      await client.subscribe(user, mediaType);

      let player = document.getElementById(`user-container-${user.uid}`);
      if (player === null) {
        const userName = await fetchUserName(id);
        player = `
       <div>
        <div class="video__container" id="user-container-${user.uid}">
       <div class="video-player" id="user-${user.uid}"></div> 
                  </div>
                   <div class="user-name">${userName}</div>
                   </div>
                 `;

        document
          .getElementById("streams__container")
          .insertAdjacentHTML("beforeend", player);
        document
          .getElementById(`user-container-${user.uid}`)
          .addEventListener("click", handleExpandVideoClick);
      }

      if (displayFrame.style.display) {
        player.style.width = "100px";
        player.style.height = "100px";
      }

      if (mediaType === "video") {
        user.videoTrack.play(`user-${user.uid}`);
      }

      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    };

    let handleUserLeft = async (user) => {
      delete remoteUsers[user.uid];
      let item = document.getElementById(`user-container-${user.uid}`);
      if (item) {
        item.remove();
      }

      if (userIdInDisplayFrame === `user-container-${user.uid}`) {
        displayFrame.style.display = null;

        let videoFrames = document.getElementsByClassName("video__container");

        for (let i = 0; videoFrames.length > i; i++) {
          videoFrames[i].style.height = "200px";
          videoFrames[i].style.width = "200px";
        }
      }
    };

    if (ready && tracks) {
      joinRoomInit(channelName);
    }

    return () => {
      client.off("user-published");
      client.off("user-unpublished");
      client.off("user-left");
    };
  }, [channelName, client, ready, tracks]);

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  let switchToCamera = async () => {
    const userName = await fetchUserName(id);

    let player = `
    <div>
    <div class="video__container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                 </div>
                  <div class="user-name">${userName}</div>
                  </div>`;
    displayFrame.insertAdjacentHTML("beforeend", player);

    await tracks[0].setMuted(true);
    await tracks[1].setMuted(true);

    tracks[1].play(`user-${uid}`);
    await client.publish([tracks[1]]);
  };

  let toggleScreen = async (e) => {
    setScreenShare(false);

    if (!sharingScreen) {
      sharingScreen = true;

      localScreenTracks = await AgoraRTC.createScreenVideoTrack();

      document.getElementById(`user-container-${uid}`).remove();
      displayFrame.style.display = "block";
      const userName = await fetchUserName(id);

      let player = `
      <div><div class="video__container" id="user-container-${uid}">
            <div class="video-player" id="user-${uid}"></div>
        </div>
         <div class="user-name">${userName}</div></div>`;

      displayFrame.insertAdjacentHTML("beforeend", player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", expandVideoFrame);

      userIdInDisplayFrame = `user-container-${uid}`;
      localScreenTracks.play(`user-${uid}`);

      await client.unpublish([tracks[1]]);
      await client.publish([localScreenTracks]);

      let videoFrames = document.getElementsByClassName("video__container");
      for (let i = 0; videoFrames.length > i; i++) {
        if (videoFrames[i].id !== userIdInDisplayFrame) {
          videoFrames[i].style.height = "100px";
          videoFrames[i].style.width = "100px";
        }
      }
    } else {
      sharingScreen = false;

      document.getElementById(`user-container-${uid}`).remove();
      await client.unpublish([localScreenTracks]);

      switchToCamera();
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="bg-gray-800 absolute top-20 left-6 rounded-xl p-2 h-[560px] w-[1150px]">
      <div className="flex gap-2 justify-between px-2">
        <div className="timer text-white">
          Class Started {formatTime(timer)}
        </div>

        <div className="flex items-center space-x-2 ">
          {/* share screen button */}
          <div>
            <button
              variant="contained"
              className={
                screenShare
                  ? "text-blue-500 p-2 text-2xl"
                  : "text-red-500 p-2 text-2xl"
              }
              onClick={toggleScreen}
            >
              <TbScreenShare />
            </button>
          </div>

          {/* mic button */}
          <div>
            <button
              variant="contained"
              className={
                trackState.audio
                  ? "text-blue-500 p-2 text-2xl"
                  : "text-red-500 p-2 text-2xl"
              }
              onClick={() => mute("audio")}
            >
              {trackState.audio ? <FaMicrophone /> : <IoIosMicOff />}
            </button>
          </div>
          <div>
            {/* camera button */}
            <button
              variant="contained"
              className={
                trackState.video
                  ? "text-blue-500 p-2 text-2xl "
                  : "text-red-500 p-2 text-2xl "
              }
              onClick={() => mute("video")}
            >
              {trackState.video ? (
                <BsCameraVideoFill />
              ) : (
                <BsCameraVideoOffFill />
              )}
            </button>
          </div>
          <div>
            {/* leave button */}
            <button
              variant="contained"
              color="default"
              className="text-2xl text-blue-400"
              onClick={() => leaveChannel()}
            >
              <IoMdExit />
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <section id="stream__container " className=" ">
          <div id="stream__box" className=""></div>
          <div id="streams__container"></div>
        </section>
      </div>
    </div>
  );
}
