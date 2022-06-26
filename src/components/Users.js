import Moment from "react-moment";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firebaseDb } from "../configs/firebase";
import defaultAvatar from "../Images/defaultAvatar.png";
import { Decrypt } from "../utils/Encryption/aes";

export default function User({ primaryUserId, secondaryUser, selectUser }) {
  const secondaryUserId = secondaryUser?.uid;
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
      className="my-0.5 px-3 flex items-center border border-black bg-gray-100 cursor-pointer hover:bg-sky-300 active:bg-sky-500"
      onClick={() => selectUser(secondaryUser)}
    >
      <div>
        <img
          className="h-12 w-12 rounded-full shrink-0"
          src={secondaryUser?.avatar || defaultAvatar}
          alt="avatar"
        />
      </div>
      <div className="ml-4 flex-1 py-1">
        <div className="flex items-bottom justify-between">
          <p className="text-grey-darkest font-semibold">
            {secondaryUser?.name}
          </p>
          {lastMessage && (
            <div className="flex">
              {lastMessage?.from === secondaryUserId && lastMessage?.unread && (
                <i className="fa-solid fa-envelope fa-bounce text-lg mx-1 text-green-500"></i>
              )}
              <p className="text-xs mx-1 text-grey-darkest">
                <Moment fromNow ago>
                  {lastMessage?.createdAt?.toDate()}
                </Moment>
              </p>
            </div>
          )}
        </div>
        {lastMessage && (
          <p className="text-grey-dark mt-0.5 text-sm truncate">
            <span className="font-semibold ">
              {lastMessage?.from === primaryUserId ? "Me : " : null}
            </span>
            {Decrypt(lastMessage?.messageText)}
          </p>
        )}
      </div>
    </div>
  );
}
