import { useState } from "react";
import { useClient } from "../setting";
import { FaMicrophone } from "react-icons/fa6";
import { IoIosMicOff } from "react-icons/io";
import { BsCameraVideoFill } from "react-icons/bs";
import { BsCameraVideoOffFill } from "react-icons/bs";
import { IoMdExit } from "react-icons/io";
export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({  audio: true, video: true});

  // let toggleMic = async (e) => {
  //   let button = e.currentTarget;
  //   if (tracks[0].muted) {
  //     await tracks[0].setMuted(false);
  //     await tracks[0].setMuted(!trackState.audio);
  //     button.classList.add("active");
  //   } else {
  //     await tracks[0].setMuted(true);
  //     await tracks[1].setEnabled(!trackState.video);
  //     button.classList.remove("active");
  //   }
  // };
  // let toggleCamera = async (e) => {
  //   let button = e.currentTarget;

  //   if (tracks[1].muted) {
  //     await tracks[1].setMuted(false);
  //     await tracks[1].setEnabled(!trackState.video);
  //     button.classList.add("active");
  //   } else {
  //     await tracks[1].setMuted(true);

  //     await tracks[1].setEnabled(!trackState.video);
  //     button.classList.remove("active");
  //   }
  // };

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setMuted(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setMuted(!trackState.video);
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

  return (
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
        {/* screen show button */}
        <button
          variant="contained"
          className={
            trackState.video
              ? "text-blue-500 p-2 text-2xl "
              : "text-red-500 p-2 text-2xl "
          }
          onClick={() => mute("video")}
        >
          {trackState.video ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
        </button>
      </div>
      <div>
        <button
          variant="contained"
          color="default"
          className="text-2xl"
          onClick={() => leaveChannel()}
        >
          <IoMdExit />
        </button>
      </div>
    </div>
  );
}
