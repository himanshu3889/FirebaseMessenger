import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, firebaseDb } from "../configs/firebase";
import SearchUser from "../components/SearchUser";
import User from "../components/Users";
import Messages from "../components/Messages";
import MessageForm from "../components/MessageForm";
import PrimaryUserHeader from "../components/PrimaryUserHeader";
import SecondaryUseHeader from "../components/SecondaryUseHeader";
import { Encrypt } from "../utils/Encryption/aes";

export default function Home() {
  const [primaryUser, setPrimaryUser] = useState("");
  const [friendUsersUid, setFriendUsersUid] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);
  const [secondaryUser, setSecondaryUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const primaryUserId = auth.currentUser.uid;

  useEffect(() => {
    getDoc(doc(firebaseDb, "users", primaryUserId)).then((docSnap) => {
      if (docSnap.exists) {
        setPrimaryUser(docSnap.data());
      }
    });

    // listen to the users/primaryUserUid document i.e take uid of friend users
    const primaryUserRef = doc(firebaseDb, "users", primaryUserId);
    const unsub = onSnapshot(primaryUserRef, (doc) => {
      let friendUsersUid = [];
      doc.data().friends.forEach((uid) => {
        friendUsersUid.push(uid);
      });
      setFriendUsersUid(friendUsersUid);

      // listen to multiple users uid documents in users collection i.e take friend users details from uid
      const usersRef = collection(firebaseDb, "users");
      const usersUidQuery = query(usersRef, where("uid", "in", friendUsersUid));
      onSnapshot(usersUidQuery, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setFriendUsers(users);
      });
    });
    return () => unsub();
  }, []);

  //  Select the User
  const selectUser = async (user) => {
    setSecondaryUser(user);
    const secondaryUserId = user.uid;
    const id =
      primaryUserId > secondaryUserId
        ? `${primaryUserId + secondaryUserId}`
        : `${secondaryUserId + primaryUserId}`;
    const msgsRef = collection(firebaseDb, "messages", id, "chat");
    const messagesQuery = query(msgsRef, orderBy("createdAt", "asc"));
    onSnapshot(messagesQuery, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });
    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(firebaseDb, "lastMessage", id));
    if (docSnap.data() && docSnap.data().from !== primaryUserId) {
      // update last message doc, set unread to false
      await updateDoc(doc(firebaseDb, "lastMessage", id), { unread: false });
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (messageText === "") return;
    const secondaryUserId = secondaryUser.uid;
    const id =
      primaryUserId > secondaryUserId
        ? `${primaryUserId + secondaryUserId}`
        : `${secondaryUserId + primaryUserId}`;

    await addDoc(collection(firebaseDb, "messages", id, "chat"), {
      messageText: Encrypt(messageText),
      from: primaryUserId,
      to: secondaryUserId,
      createdAt: Timestamp.fromDate(new Date()),
    });
    await setDoc(doc(firebaseDb, "lastMessage", id), {
      messageText: Encrypt(messageText),
      from: primaryUserId,
      to: secondaryUserId,
      createdAt: Timestamp.fromDate(new Date()),
      unread: true,
    });
    setMessageText("");
  };

  return (
    <div className="h-screen sticky top-0">
      <div className="flex border border-grey rounded shadow-lg h-full">
        {/* <!-- Left --> */}
        <div className="w-1/3 border flex flex-col">
          {/* <!-- Primary User Header --> */}
          <PrimaryUserHeader primaryUser={primaryUser} />

          {/* <!-- Search --> */}
          <SearchUser primaryUserId={primaryUserId} selectUser={selectUser} />
          {/* <!-- Friends --> */}
          <div className="bg-white flex-1 overflow-auto divide-y ">
            {friendUsers.map((user) => (
              <User
                key={user.uid}
                secondaryUser={user}
                selectUser={selectUser}
                primaryUserId={primaryUserId}
              />
            ))}
          </div>
        </div>

        {/* <!-- Right --> */}
        <div className="w-2/3 border flex flex-col">
          {/* <!-- Seondary User Header --> */}
          <SecondaryUseHeader secondaryUser={secondaryUser} />
          {/* <!-- Messages --> */}
          <div
            className="flex-1 overflow-auto"
            style={{ backgroundColor: "#DAD3CC" }}
          >
            {messages.length
              ? messages.map((message, idx) => (
                  <Messages
                    key={idx}
                    message={message}
                    primaryUserId={primaryUserId}
                  />
                ))
              : null}
          </div>

          {/* <!-- Message Input --> */}
          {secondaryUser && (
            <MessageForm
              handleSubmit={handleMessageSubmit}
              messageText={messageText}
              setMessageText={setMessageText}
            />
          )}
        </div>
      </div>
    </div>
  );
}
