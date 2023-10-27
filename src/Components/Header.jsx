import tabs from "../sidetabs.json";
import { StudentAuth } from "../config/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from '../hooks/useGetUserInfo'
const Header = () => {
  const navigate = useNavigate();
  const { name, profilePhoto } = useGetUserInfo(); // Add a default empty object to handle null data
  console.log("profile img")
console.log(profilePhoto)

  const signUserOut = async () => {
    try {
      await signOut(StudentAuth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-10 transition-transform -translate-x-full  border border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-2 overflow-y-auto bg-white ">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
         <p>Hello</p> <p className="text-green-500">{name}</p>
          <ul className="mt-32 space-y-4 font-medium text-left">
            {tabs.map((item) => (
              <li>
                <p className="border-b flex items-center p-4 rounded-lg  hover:bg-gray-100 group">
                  {/* <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg> */}
                  <span className="ml-3">{item.title}</span>
                </p>
              </li>
            ))}
          </ul>

          <button
            className="flex absolute pb-6 bottom-0 left-6 font-bold"
            onClick={signUserOut}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Header;
