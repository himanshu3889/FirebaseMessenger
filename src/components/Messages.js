import React from "react";
import Moment from "react-moment";
import { useRef, useEffect } from "react";
import { Decrypt } from "../utils/Encryption/aes";

export default function Messages({ message, primaryUserId }) {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);


  return (
    <div className="py-2 px-3">
      <div
        className={`flex mb-2 ${
          message?.from === primaryUserId ? "justify-start " : "justify-end "
        }`}
        ref={scrollRef}
      >
        <div
          className={`rounded py-2 px-3 ${
            message?.from === primaryUserId
              ? "bg-gray-100 hover:bg-gray-200"
              : "bg-green-200 hover:bg-green-300"
          }`}
        >
          {/* <p className="text-sm text-teal">User Name</p> */}
          <p className="mb-0">{Decrypt(message?.messageText)}</p>
          <p className="text-right font-semibold text-xs text-gray-500">
            <Moment fromNow ago>
              {message?.createdAt?.toDate()}
            </Moment>
          </p>
        </div>
      </div>
    </div>
  );
}
