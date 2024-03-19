import { AgoraVideoPlayer } from "agora-rtc-react";
import { useState, useEffect } from "react";

export default function Video(props) {
  const { users, tracks } = props;
  const [divSpacing, setdivSpacing] = useState(12);
  console.log("usersAdded ", users);
  useEffect(() => {
    setdivSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  }, [users, tracks]);

  return (
    <div className="h-full">
      <div className={`grid grid-cols-${divSpacing}`}>
        <AgoraVideoPlayer videoTrack={tracks[1]} className="h-full w-full" />
      </div>
      {users.length > 0 &&
        users.map((user) => {
            <p>{user.uid}</p>
              if (user.videoTrack) {
            return (
              <div className={`grid grid-cols-${divSpacing}`} key={user.uid}>
                {user.uid}
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  className="h-full w-full"
                />

              </div>
            );
          } else return null;
        })}
    </div>
  );
}
