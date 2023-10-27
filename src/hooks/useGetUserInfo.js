export const useGetUserInfo = () => {
    const storedAuthData = JSON.parse(localStorage.getItem("auth")) || {}; // Default to an empty object if 'auth' is not found or is null
    const { name, profilePhoto, userID, isAuth } = storedAuthData;
    return { name, profilePhoto, userID, isAuth };
  };
  