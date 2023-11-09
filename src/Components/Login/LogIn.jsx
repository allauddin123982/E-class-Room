import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";

const LogIn = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const navigate = useNavigate();

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
        const user = res.user;
        console.log("Helo login ",user)
        const role = user.displayName;
        const userId = user.uid;
        console.log(userId)
        if (role === "student") {
          navigate(`/studentDashboard/${userId}`);
        } else if (role === "teacher") {
          navigate("/teacherDashboard");
        }else{
          setError(res.err.message);
        }
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setError(err.message);
      });
  };

  return (
    <div className="flex justify-center p-10">
      <div className="border bg-gray-100 w-[350px] mt-10">
        <h1 className="text-2xl">Login</h1>
        <form onSubmit={handleSubmit} className="  p-2">
          <div className="mt-2 flex flex-col items-start">
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
          <div className="mt-2 flex flex-col items-start">
            <label htmlFor="password">Password: 123456</label>
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
          {error ? <p className="text-bold text-red-600">{error}</p> : null}

          <div className="mt-2 flex flex-col items-start">
            <button
              type="submit"
              disabled={submitButtonDisabled}
              className={`${
                submitButtonDisabled ? "cursor-not-allowed" : null
              } border p-1`}
              onClick={handleSubmit}
            >
              Login
            </button>

            <div className="mt-6 text-sm">
              Create an account
              <Link to={"/"}>
                <button className="border ms-2 p-1 ">Sign Up</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
