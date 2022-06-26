import React, { useEffect, useState } from "react";
import defaultAvatar from "../Images/defaultAvatar.png";
import { auth, firebaseDb, firebaseStorage } from "../configs/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Moment from "react-moment";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");

  function handleImage(e) {
    const image = e.target.files[0];
    const maxSize = 1 * 1024 * 1024;
    if (image && image.size < maxSize) {
      setImg(image);
    } else {
      setImg("");
      window.alert(
        `file size should be less than ${maxSize / 1024 / 1024} MB `
      );
    }
  }

  useEffect(() => {
    getDoc(doc(firebaseDb, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setCurrentUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {
        setIsLoading(true);
        const imgRef = ref(
          firebaseStorage,
          `avatar/${auth.currentUser.uid} - ${new Date().getTime()} `
        );
        try {
          if (currentUser.avatarPath) {
            await deleteObject(ref(firebaseStorage, currentUser.avatarPath));
          }

          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(
            ref(firebaseStorage, snap.ref.fullPath)
          );
          await updateDoc(doc(firebaseDb, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (err) {
          await updateDoc(doc(firebaseDb, "users", auth.currentUser.uid), {
            avatar: "",
            avatarPath: "",
          });
          console.log(err.message);
          setImg("");
        }
        setIsLoading(false);
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () => {
    setIsLoading(true);
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(firebaseStorage, currentUser.avatarPath));
        await updateDoc(doc(firebaseDb, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
      }
      setImg(null);
    } catch (err) {
      await updateDoc(doc(firebaseDb, "users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: "",
      });
      console.log(err.message);
    }
    setIsLoading(false);
  };

  function Loading() {
    return (
      <i className="fas fa-circle-notch fa-spin flex justify-center mt-6 mb-4 text-xl  text-green-500"></i>
    );
  }

  return (
    <div className=" max-w-sm pb-5 mx-auto mt-4 overflow-hidden rounded-lg shadow-lg">
      <div className="h-40 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
        <div className="flex justify-center">
          <span className="mt-10 text-4xl font-extrabold text-white">
            {currentUser?.name}
          </span>
        </div>
        <div className="flex justify-center">
          <img
            className="object-cover w-24 h-24 mt-4 border-4 border-blue-600 rounded-full"
            src={currentUser?.avatar || defaultAvatar}
            alt="Avatar"
          />
        </div>
      </div>
      <div className="px-6 py-4">
        {isLoading ? (
          Loading()
        ) : (
          <div className="flex justify-center mt-6 mb-4 ">
            <label
              className="cursor-pointer font-bold mr-3 text-blue-500 hover:text-blue-800 "
              htmlFor="avatar"
            >
              {`${currentUser?.avatar ? "Change photo" : "Add photo"}`}
            </label>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              id="avatar"
              onChange={(e) => handleImage(e)}
            />

            {currentUser?.avatar && (
              <span
                className="cursor-pointer font-bold text-red-500 hover:text-red-800 "
                onClick={deleteImage}
              >
                Delete photo
              </span>
            )}
          </div>
        )}

        <div className="flex items-center my-1 text-gray-600">
          <i className="fa-solid fa-envelope text-lg mr-4"></i>
          <span>{currentUser?.email}</span>
        </div>
        <div className="flex items-center my-1 text-gray-600">
          <span className="fa-solid fa-calendar-plus text-lg mr-4"></span>
          <Moment format="DD/MM/YYYY hh:mm:ss">
            {currentUser?.createdAt?.toDate()}
          </Moment>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <a
          type="button"
          href="/"
          className="cursor-pointer inline-flex items-center px-6 py-2 font-medium leading-6 text-white border rounded bg-indigo-600 hover:bg-indigo-500 focus:outline-none  active:bg-indigo-700"
        >
          Home
        </a>
      </div>
    </div>
  );
}
