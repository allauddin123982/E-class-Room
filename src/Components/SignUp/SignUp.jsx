import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
const SignUp = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password || !values.role) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(
      auth,
      values.email,
      values.password
    )
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        console.log({ user });
        await updateProfile(user, {
          displayName: values.role, //set user name
        });

        navigate("/login");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setError(err.message);
      });
  };

  return (
    <>
      <div className="flex justify-center ">
        <div className="border bg-gray-100 w-[350px] mt-10">
          <h1 className="text-2xl">Sign up</h1>
          <form onSubmit={handleSubmit} className="p-2">
            <div className="mt-2 flex flex-col items-start">
              <p htmlFor="email" className="">
                Email:
              </p>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, email: event.target.value }))
                }
                className="border w-full"
              />
            </div>
            <div className="mt-2 flex flex-col items-start">
              <p htmlFor="password" className="">
                Password: 123456
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
                    setValues((prev) => ({ ...prev, role: event.target.value }))
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
                    setValues((prev) => ({ ...prev, role: event.target.value }))
                  }
                  className="border ms-1"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-col items-start">
              <button
                type="submit"
                disabled={submitButtonDisabled}
                className={`${
                  submitButtonDisabled ? "cursor-not-allowed" : null
                } border p-1`}
              >
                Submit
              </button>
              <div className="mt-5 pb-2">
                Already have account ?
                <Link to="/login">
                  <button className="border ms-2 p-1">Login</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
