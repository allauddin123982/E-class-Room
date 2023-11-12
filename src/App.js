import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from "./Components/Login/LogIn";
import SignUp from "./Components/SignUp/SignUp";
import TeacherDashBoard from "./Components/Teacher/TeacherDashBoard";
import StudentDashBoard from "./Components/Student/StudentDashBoard";
function App() {
 
  return (
    <>
      <div className="App">
 
        <Router>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/studentDashboard/:id" element={<StudentDashBoard />} />
            <Route path="/teacherDashboard/:id" element={<TeacherDashBoard />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
