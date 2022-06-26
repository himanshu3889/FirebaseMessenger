import React from "react";
import defaultAvatar from "../Images/defaultAvatar.png";
import { signOut } from "firebase/auth";
import { auth } from "../configs/firebase";
import { useNavigate } from "react-router-dom";

export default function PrimaryUserHeader({ primaryUser }) {
  const navigate = useNavigate();
  function handleSignuout() {
    signOut(auth)
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.log("Unable to logOut");
      });
  }

  return (
    <div className="py-2 px-3 text-white flex flex-row justify-between items-center bg-teal-700">
      <a href="/profile">
        <img
          className="w-10 h-10 rounded-full shrink-0"
          src={primaryUser?.avatar || defaultAvatar}
          title="Show Profile"
          alt="avatar"
        />
      </a>
      <div className="ml-4 flex-1 ">
        <div className="flex items-bottom justify-between">
          <span className="font-bold">{primaryUser?.name}</span>
          <div>
            <a href="/profile" title="Show Profile" className="mr-6 font-semibold hover:text-blue-200">Profile</a>
            <i
              className="fa-solid fa-arrow-right-from-bracket cursor-pointer mr-2 text-xl text-red-400 hover:text-2xl active:text-red-600"
              title="Logout"
              onClick={handleSignuout}
            ></i>
          </div>
        </div>
        <span className="mt-1 text-xs">{primaryUser?.email}</span>
      </div>
    </div>
  );
}
