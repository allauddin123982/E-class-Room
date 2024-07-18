import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import loginBg from "../../assets/loginBg.png";

const LogIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const { uid: userId, displayName: role } = JSON.parse(currentUser);
      if (role === "student") {
        navigate(`/studentDashboard/${userId}`);
      } else if (role === "teacher") {
        navigate(`/teacherDashboard/${userId}`);
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        console.log(res);
        const { uid: userId, displayName: role } = res.user;
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ uid: userId, role })
        );
        if (role === "student") {
          navigate(`/studentDashboard/${userId}`);
        } else if (role === "teacher") {
          navigate(`/teacherDashboard/${userId}`);
        } else {
          setError("Unknown role");
        }
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setError(err.message);
      });
  };

  return (
    <div
      className="flex justify-center p-10 h-screen bg-no-repeat bg-cover "
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div>
        <h1 className="text-2xl font-serif font-bold pt-2 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-md relative top-32 left-6 w-[306px] h-[50px]">
          Login
        </h1>
        <div className="border bg-white w-[350px] h-[300px] mt-[100px] rounded-lg">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mt-8 flex flex-col items-start">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={(event) => {
                  setValues((prev) => ({ ...prev, email: event.target.value }));
                }}
                className="border w-full"
              />
            </div>
            <div className="mt-4 flex flex-col items-start">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={(event) => {
                  setValues((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
                className="border w-full"
              />
            </div>

            <div className="mt-5 flex flex-col items-start">
              <button
                type="submit"
                disabled={submitButtonDisabled}
                className={`${
                  submitButtonDisabled ? "cursor-not-allowed" : null
                } border p-1 bg-gray-200 hover:bg-white rounded`}
              >
                Login
              </button>

              <div className="mt-6 text-sm">
                Create an account
                <Link to={"/"}>
                  <button className="border ms-2 p-1 bg-gray-200 hover:bg-white rounded ">
                    Sign Up
                  </button>
                </Link>
              </div>
              {error ? <p className="text-bold text-red-600">{error}</p> : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
