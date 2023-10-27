import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./Pages/auth/SignIn";
import { Home } from "./Pages/loggedin/index";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" exact element={<Auth />} />
            <Route path="/loggedin" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
