import Moment from "react-moment";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firebaseDb } from "../configs/firebase";
import defaultAvatar from "../Images/defaultAvatar.png";
import { Decrypt } from "../utils/Encryption/aes";

export default function User({ primaryUserId, user, selectUser }) {
  const secondaryUserId = user?.uid;
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const id =
      primaryUserId > secondaryUserId
        ? `${primaryUserId + secondaryUserId}`
        : `${secondaryUserId + primaryUserId}`;
    let unsub = onSnapshot(doc(firebaseDb, "lastMessage", id), (doc) => {
      setLastMessage(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <div
      className="flex justify-between items-center bg-white mt-2 mx-1 p-2 hover:shadow-lg rounded cursor-pointer transition"
      onClick={() => selectUser(user)}
    >
      <div className="flex ml-2">
        <img
          src={user?.avatar || defaultAvatar}
          alt="avatar"
          width="40"
          height="40"
          className="rounded-full hidden md:flex md:visible"
        />
        <div className="flex flex-col ml-2">
          <span className="font-medium text-black">{user?.name}</span>
          {lastMessage && (
            <span className="text-sm text-gray-500 truncate w-32">
              <span className="font-semibold text-gray-600 ">
                {lastMessage?.from === primaryUserId ? "Me : " : null}{" "}
              </span>
              {Decrypt(lastMessage?.messageText)}
            </span>
          )}
        </div>
      </div>
      {lastMessage && (
        <div className="flex flex-col items-center">
          {lastMessage?.from === secondaryUserId && lastMessage?.unread && (
            <i className="fa-solid fa-envelope fa-bounce text-lg mx-1 text-green-500"></i>
          )}
          <span className="text-gray-400 text-sm">
            <Moment fromNow ago>
              {lastMessage?.createdAt?.toDate()}
            </Moment>
          </span>
        </div>
      )}
    </div>
  );
}
