import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "../setting.js";
import { videoCallDom } from "./videoCallDom.js";
import Controls from "./Controls";
import "./videoCall.css";
export default function VideoCall(props) {
  const { setInCall } = props; //true
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [timer, setTimer] = useState(0);
  const client = useClient(); //to connect to video call
  const { expandVideoFrame,  displayFrame, userIdInDisplayFrame  } = videoCallDom();

  const { ready, tracks } = useMicrophoneAndCameraTracks();
  let uid = sessionStorage.getItem("uid");
  if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem("uid", uid);
  }
  let remoteUsers = {};

  useEffect(() => {
    videoCallDom();
  }, []);

  const handleExpandVideoClick = (e) => {
    expandVideoFrame(e);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Convert timer value to HH:MM:SS format
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
      let player = `<div class="video__container" id="user-container-${uid}">
      <div class="video-player" id="user-${uid}"></div>
   </div>`;

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
        player = `<div class="video__container" id="user-container-${user.uid}">
                  <div class="video-player" id="user-${user.uid}"></div>
              </div>`;

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
        displayFrame.style.display = null
 
        let videoFrames = document.getElementsByClassName('video__container')

        for(let i = 0; videoFrames.length > i; i++){
            videoFrames[i].style.height = '200px'
            videoFrames[i].style.width = '200px'
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

  return (
    <div className="bg-green-300 absolute top-20 left-6 border border-black h-[560px] w-[1150px]">
      <div className="flex gap-2 justify-between px-2">
        <div className="timer">Class Started {formatTime(timer)}</div>
        <div className="">
          {ready && tracks && (
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
            />
          )}
        </div>
      </div>

      <div className="">
        <section id="stream__container">
          <div id="stream__box" className="bg-red-400"></div>
          <div id="streams__container"></div>
        </section>
      </div>
    </div>
  );
}
