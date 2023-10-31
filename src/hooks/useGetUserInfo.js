import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useGetUserInfo = () => {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, you can access the UID
        const uid = user.uid;
        setUserID(uid);
        console.log(userID)
      } else {
        // User is signed out or not authenticated
        setUserID(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return { userID };
};
