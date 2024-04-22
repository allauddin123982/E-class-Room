import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "../setting.js";
import { videoCallDom } from "./videoCallDom.js";
import { FaMicrophone } from "react-icons/fa6";
import { IoIosMicOff } from "react-icons/io";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
import "./videoCall.css";
export default function VideoCall(props) {
  const { setInCall, stdPropData, thrPropData } = props; //true
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [timer, setTimer] = useState(0);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const client = useClient(); //to connect to video call
  const { expandVideoFrame, displayFrame, userIdInDisplayFrame } =
    videoCallDom();

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
      let player = `
  <div class="video__container" id="user-container-${uid}">
    <div class="video-player" id="user-${uid}"></div>
  </div>
  <p className="border-4 border-white text-2xl text-white w-24 mt-5 ml-28">
          {stdPropData.namee}
          </p>
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

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  // console.log("helo ", stdPropData)
  return (
    <div className="bg-gray-800 absolute top-20 left-6 rounded-xl p-2 h-[560px] w-[1150px]">
      <div className="flex gap-2 justify-between px-2">
        <div className="timer text-white">
          Class Started {formatTime(timer)}
        </div>

        <div className="flex items-center space-x-2 ">
          <div>
            {/* mic button */}
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
        <section id="stream__container">
          <div id="stream__box" className="bg-red-400"></div>
          <div id="streams__container"></div>

          {/* 
          {!trackState.video ? <img src={thrPropData.img} /> : null}
          {!trackState.video ? <img src={stdPropData.img} /> : null} */}
        </section>
      </div>
    </div>
  );
}
