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
    <>
      <div className="h-[400px] bg-red-500">
        video streams
        <div>
        <AgoraVideoPlayer videoTrack={tracks[1] } className="h-full w-full" />
      </div>
        {users.length > 0 ? (
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <div
                  key={user.uid}
                  className={`grid grid-cols-${divSpacing} w-[200px] h-[100px] m-10`}
                >
                  
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    className="h-[100px] w-[200px] border"
                  />
                  {/* Display Student Name with student  */}
                 
                </div>
              );
            } else return null;
          })
        ) : (
          <p>no users</p>
        )}
      </div>
    </>
  );
}
