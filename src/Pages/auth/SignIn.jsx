//3
import {} from "../../config/firebase-config";
import {signInWithPopup} from "firebase/auth"; 
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const navigate = useNavigate();

  const signInTeacher = async() => {
     //4 call popup
    const results = await signInWithPopup(TeacherAuth, TeacherProvider)//user just signed in
    console.log({results})
    //5 keep track of user_id, user_name, userProfilepic and login or not 
    //6 then store that info to local storage and when refresh info still remain
    const StoreTeacherAuth = {
      userID: results.user.uid,
      name:results.user.displayName,
      profilePhoto:results.user.photoURL,
      isAuth:true
    }
    localStorage.setItem("TeacherAuth", JSON.stringify(StoreTeacherAuth)); //in local we cannot store objects but only boolean,string, Numbers    

    //after login 
    navigate("/loggedin")

  }

  const signInWithGoogleStudent = async() => {
     //4 call popup
    const results = await signInWithPopup(StudentAuth, StudentProvider)//user just signed in
    console.log({results})
    //5 keep track of user_id, user_name, userProfilepic and login or not 
    //6 then store that info to local storage and when refresh info still remain
    const StoreStudentAuth = {
      userID: results.user.uid,
      name:results.user.displayName,
      profilePhoto:results.user.photoURL,
      isAuth:true
    }
    localStorage.setItem("StudentAuth", JSON.stringify(StoreStudentAuth)); //in local we cannot store objects but only boolean,string, Numbers    

    //after login 
    navigate("/loggedin")

  }
  return (
    <div className="mt-10 m-2">
      <p>Sign in with google to continue</p>
      <button className=" p-2 bg-blue-500 text-white rounded mt-2" onClick={signInWithGoogleTeacher}>
        Teacher
      </button>
      <button className="ms-2 p-2 bg-blue-500 text-white rounded mt-2" onClick={signInWithGoogleStudent}>
        Student
      </button>
    </div>
  );
};
