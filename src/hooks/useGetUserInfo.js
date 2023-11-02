import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useGetUserInfo = () => {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserID(uid);
      } else {
        setUserID(null);
      }
    });

    return () => unsubscribe();
  }, []); // An empty dependency array means it only runs when the component mounts

  return { userID };
};
