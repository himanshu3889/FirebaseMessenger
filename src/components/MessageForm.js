import React from "react";

export default function MessageForm({
  handleSubmit,
  messageText,
  setMessageText,
}) {
  return (
    <form
      className="relative bg-gray-300 px-4 py-4 flex items-center border-t-2"
      onSubmit={handleSubmit}
    >
      <div className="flex-1 mx-4">
        <input
          className="w-full border rounded px-2 py-2"
          type="text"
          placeholder="Message"
          name="message"
          autoComplete="off"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">
          <i className="fa-solid fa-paper-plane text-2xl cursor-pointer text-blue-600 active:text-blue-800 "></i>
        </button>
      </div>
    </form>
  );
}
