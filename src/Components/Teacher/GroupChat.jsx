import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { IoSearch } from "react-icons/io5";
import { useParams } from "react-router-dom";
import ChatBox from "./Chatbox";

const GroupChat = () => {
  const [fetchStudentData, setFetchStudentData] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [foundStudent, setFoundStudent] = useState(null);
  const [takeName, setTakeName] = useState("");
  const [searched, setSearched] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null); // State to handle active group for chat
  const { id } = useParams();

  // Fetch students
  useEffect(() => {
    const fetchStudentData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, `studentdata/`));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFetchStudentData(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchStudentData();
  }, []);

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      let groups = [];
      try {
        const querySnapshot = await getDocs(collection(db, `groups/`));
        querySnapshot.forEach((doc) => {
          groups.push({ id: doc.id, ...doc.data() });
        });
        setGroupList(groups);
        setFilteredGroups(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, []);

  const addStudentToGroup = (student) => {
    const isStudentInGroup = selectedStudents.some(
      (std) => std.uid === student.uid
    );
    if (isStudentInGroup) {
      setSelectedStudents((prevList) =>
        prevList.filter((std) => std.uid !== student.uid)
      );
    } else {
      setSelectedStudents((prevList) => [...prevList, student]);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupName || selectedStudents.length === 0) {
      alert("Group name and at least one student are required.");
      return;
    }

    try {
      const groupData = {
        groupName,
        members: selectedStudents,
        createdBy: id,
      };

      const groupDocRef = doc(db, `groups/${groupName}`);
      await setDoc(groupDocRef, groupData);

      setGroupList((prevList) => [...prevList, groupData]);
      setFilteredGroups((prevList) => [...prevList, groupData]);
      setGroupName("");
      setSelectedStudents([]);
      console.log("Group created successfully");
    } catch (error) {
      console.error("Error creating group: ", error);
    }
  };

  const searchStudentFunc = () => {
    const foundStudent = fetchStudentData.find(
      (student) => student.reg.toLowerCase() === takeName.toLowerCase()
    );
    setFoundStudent(foundStudent);
    setSearched(true);
  };

  const showAllStudents = () => {
    setSearched(false);
    setTakeName("");
  };

  const searchGroupFunc = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setGroupSearch(searchQuery);
    const filtered = groupList.filter((group) =>
      group.groupName.toLowerCase().includes(searchQuery)
    );
    setFilteredGroups(filtered);
  };

  const handleOpenChat = (group) => {
    setActiveGroup(group);
  };

  const handleCloseChat = () => {
    setActiveGroup(null);
  };

  return (
    <>
      <div className="absolute right-0 top-20 mx-20 flex justify-center gap-3">
        <div className="bg-white w-[500px] p-4 rounded-xl shadow-xl">
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Groups</h2>
            <input
              type="text"
              className="border p-1 mt-2 w-full"
              placeholder="Search group by name"
              value={groupSearch}
              onChange={searchGroupFunc}
            />
            {filteredGroups.map((group, index) => (
              <div
                key={index}
                className="mt-2 p-4 border rounded-lg hover:bg-gray-100 transition-all"
              >
                <h3 className="font-bold text-xl">{group.groupName}</h3>
                <ul className="ml-4 mt-2 list-disc">
                  {group.members.map((member) => (
                    <li key={member.uid}>{member.namee}</li>
                  ))}
                </ul>
                <button
                  className="border p-2 bg-blue-500 text-white rounded-lg mt-2 hover:bg-blue-600 transition-all"
                  onClick={() => handleOpenChat(group)}
                >
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bg-white top-24 left-96 w-[500px] p-4 rounded-xl shadow-xl">
        <div className="flex gap-x-2">
          <input
            type="text"
            className="border p-2 flex-1 rounded-lg"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="border p-2 bg-gray-200 font-semibold rounded-lg hover:border hover:border-black transition-all"
            onClick={createGroup}
          >
            Create Group
          </button>
        </div>
        <table className="table w-full mt-4">
          <thead>
            <tr className="bg-gray-900 text-white h-14">
              <th>-</th>
              <th>Name</th>
              <th>Reg no</th>
              <th>Semester</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            {searched && !foundStudent ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  <p>No student found</p>
                </td>
              </tr>
            ) : (
              searched &&
              foundStudent && (
                <tr className="hover:bg-gray-100 transition-all">
                  <td className="p-2 flex justify-center">
                    <img
                      src={foundStudent.img}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="text-left">{foundStudent.namee}</td>
                  <td>{foundStudent.reg}</td>
                  <td>{foundStudent.sem}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.some(
                        (std) => std.uid === foundStudent.uid
                      )}
                      onChange={() => addStudentToGroup(foundStudent)}
                    />
                  </td>
                </tr>
              )
            )}

            {!searched &&
              fetchStudentData.map((element, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-all">
                  <td className="p-2 flex justify-center">
                    <img
                      src={element.img}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="text-left">{element.namee}</td>
                  <td>{element.reg}</td>
                  <td>{element.sem}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedStudents.some(
                        (std) => std.uid === element.uid
                      )}
                      onChange={() => addStudentToGroup(element)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {activeGroup && (
        <ChatBox
          groupId={activeGroup.id}
          groupName={activeGroup.groupName}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export default GroupChat;
