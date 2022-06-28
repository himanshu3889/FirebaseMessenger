import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseDb } from "../configs/firebase";
import useDebounce from "../utils/hooks/useDebounce";
import defaultAvatar from "../Images/defaultAvatar.png";
import { useRef } from "react";

export default function SearchUser({ primaryUserId, selectUser }) {
  const [users, setUsers] = useState([]);
  const [isShowingUsers, setIsShowingUsers] = useState(false);
  const [searchText, setSearchText] = useState("");
  const firstUpdate = useRef(true);
  const debounce = useDebounce();

  function fetchUsers() {
    searchText === "" ? fetchAllUsers() : fetchSearchUsers();
    firstUpdate.current
      ? (firstUpdate.current = false)
      : setIsShowingUsers(true);
  }

  const fetchSearchUsers = async () => {
    const usersRef = collection(firebaseDb, "users");
    const usersUidQuery = query(
      usersRef,
      where("uid", "not-in", [primaryUserId]),
      where("name", "==", searchText)
    );
    onSnapshot(usersUidQuery, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
  };

  const fetchAllUsers = async () => {
    const usersRef = collection(firebaseDb, "users");
    const usersUidQuery = query(
      usersRef,
      where("uid", "not-in", [primaryUserId])
    );
    onSnapshot(usersUidQuery, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
  };

  const addFriend = async (user) => {
    const primaryUserIdRef = doc(firebaseDb, "users", primaryUserId);
    await updateDoc(primaryUserIdRef, {
      friends: arrayUnion(user.uid),
    });
    const userIdRef = doc(firebaseDb, "users", user.uid);
    await updateDoc(userIdRef, {
      friends: arrayUnion(primaryUserId),
    });
  };

  const handleClick = async (user) => {
    await addFriend(user);
    await selectUser(user);
    setIsShowingUsers(false)
  };

  useEffect(() => {
    debounce(() => fetchUsers());
  }, [searchText]);

  return (
    <div className="mt-1 relative">
      <div className="flex">
        <input
          type="text"
          className="relative w-full flex-1 mx-1 bg-white border-2 border-gray-400 rounded-md shadow-sm pl-3 pr-3 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          autoComplete="off"
          placeholder="Search User"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
        <div>
          <button
            type="submit"
            onClick={() => setIsShowingUsers(!isShowingUsers)}
          >
            <i
              className={`fa-solid ${
                isShowingUsers ? "fa-xmark" : "fa-search"
              } text-2xl text-gray-500 hover:text-yellow-600 mx-2`}
            ></i>
          </button>
        </div>
      </div>
      {isShowingUsers && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-52 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {users.map((user) => (
            <li
              className="text-gray-900 cursor-pointer relative py-1 px-3 mx-2 border rounded border-black bg-indigo-100 hover:bg-indigo-300 active:bg-indigo-400"
              onClick={() => handleClick(user)}
              key={user.uid}
            >
              <div className="flex items-center">
                <img
                  className="flex-shrink-0 h-8 w-8 rounded-full"
                  src={user?.avatar || defaultAvatar}
                  alt="avatar"
                />
                <span className=" ml-3 block ">{user.name}</span>
                <span className="text-xs ml-3 block truncate">
                  {user.email}
                </span>
              </div>
              <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4"></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
