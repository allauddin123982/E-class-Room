import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <p className="text-green-500">Home</p>
      <div className="flex justify-center gap-20 mt-20">
        <Link to={"/signup"}>
          <p className="text-blue-500">Student</p>
        </Link>
        <Link to={"/signup"}>
          <p className="text-blue-500">Teacher</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
