import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../../assets/loginBg.png";
import { doc, setDoc } from "firebase/firestore";
const SignUp = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.email || !values.password || !values.role) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setSubmitButtonDisabled(true);

    const res = await createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    )
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        // const user = res.user;
        // console.log({ user });

        await updateProfile(res.user, {
          displayName: values.role, //set user name
        });

        if (values.role === "student") {
          await setDoc(doc(db, "studentdata", res.user.uid), {
            uid: res.user.uid,
            email: values.email,
            role: values.role,
            // Add more fields as needed
          });
          
        } else {
          await setDoc(doc(db, "teacherdata", res.user.uid), {
            uid: res.user.uid,
            email: values.email,
            role: values.role,
            // Add more fields as needed
          });
        }

        navigate("/login");
      })

      .catch((err) => {
        setSubmitButtonDisabled(false);
        setError(err.message);
      });
  };

  return (
    <>
      <div
        className="flex justify-center h-screen bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div>
          <h1 className="text-2xl font-serif font-bold pt-2 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-md relative top-44 left-6  w-[306px] h-[55px]">
            Sign up
          </h1>
          <div className="border bg-white rounded-lg w-[350px] h-[330px] mt-36  ">
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mt-8 flex flex-col items-start">
                <p htmlFor="email" className="">
                  Email:
                </p>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="border w-full"
                />
              </div>
              <div className="mt-4 flex flex-col items-start">
                <p htmlFor="password" className="">
                  Password:
                </p>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  className="border w-full"
                />
              </div>
              {error ? <p className="text-bold text-red-600">{error}</p> : null}

              <div className="mt-2 flex items-center gap-5">
                <div className="student">
                  <label htmlFor="student">Student:</label>
                  <input
                    type="radio"
                    id="student"
                    name="role"
                    value="student"
                    checked={values.role === "student"}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                    className="border ms-1"
                  />
                </div>
                <div className="teacher">
                  <label htmlFor="teacher">Teacher:</label>
                  <input
                    type="radio"
                    id="teacher"
                    name="role"
                    value="teacher"
                    checked={values.role === "teacher"}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        role: event.target.value,
                      }))
                    }
                    className="border ms-1"
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-col items-start">
                <button
                  type="submit"
                  disabled={submitButtonDisabled}
                  className={`${
                    submitButtonDisabled ? "cursor-not-allowed" : null
                  } border p-1 bg-gray-200 hover:bg-white rounded`}
                >
                  Submit
                </button>
                <div className="mt-3">
                  Already have account ?
                  <Link to="/login">
                    <button className="border ms-2 p-1 bg-gray-200 hover:bg-white rounded">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
