import React from "react";
import defaultAvatar from "../Images/defaultAvatar.png";

export default function SecondaryUseHeader({ secondaryUser }) {
  return (
    <div className="text-white py-2 px-3 flex flex-row justify-between items-center bg-teal-700">
      <div className="flex items-center">
        <div>
          <img
            className="w-10 h-10 rounded-full"
            src={secondaryUser?.avatar || defaultAvatar}
            alt="avatar"
          />
        </div>
        {!secondaryUser && (
          <i className="fa-solid fa-regular fa-fade">Select User</i>
        )}
        <div className="ml-4">
          <p className="">{secondaryUser?.name}</p>
          <p className="text-xs mt-1">{secondaryUser?.email}</p>
        </div>
      </div>
    </div>
  );
}
