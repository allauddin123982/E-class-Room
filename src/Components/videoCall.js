import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "../setting.js";
import Video from "./Video";
import Controls from "./Controls";

export default function VideoCall(props) {
  const { setInCall } = props; //true
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient(); //to connect to video call
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  let uid = sessionStorage.getItem('uid')
  if(!uid){
      uid = String(Math.floor(Math.random()*10000))
      sessionStorage.setItem('uid',uid)
  }
  useEffect(() => {
    let joinRoomInit = async (name) => {
      try {
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {

            setUsers((prevUsers) => [...prevUsers, user]);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
            setUsers((prevUsers) => [...prevUsers, user]);
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio" && user.audioTrack) user.audioTrack.stop();
          if (mediaType === "video") {
            setUsers((prevUsers) =>
              prevUsers.filter((User) => User.uid !== user.uid)
            );
          }
        });

        client.on("user-left", (user) => {
          setUsers((prevUsers) =>
            prevUsers.filter((User) => User.uid !== user.uid)
          );
        });

        await client.join(config.appId, name, config.token, config.uid);
        joinStream()
        if (tracks) await client.publish([tracks[0], tracks[1]]);//here
        setStart(true);
      } catch (error) {
        console.error("Error initializing video call:", error);
      }
    };
    let joinStream = async () => {
      //const { ready, tracks } = useMicrophoneAndCameraTracks();
      let player = `<div class="video__container" id="user-container-${uid}">
        <div class="video-player" id="user-${uid}"></div>
      </div>`
      document.getElementById("streams__container").insertAdjacentElement("beforeend", player)
      tracks[1].play(`user-${uid}`)
    }


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
    <div className="bg-green-300 absolute top-20 left-10 border border-black  flex flex-col h-[550px] w-[1100px]">
      Class Started
      <div className="">
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </div>
      <div className="">
        {start && tracks && <Video tracks={tracks} users={users} />}
      </div>
    </div>
  );
}
