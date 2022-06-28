import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, firebaseDb } from "../configs/firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import Loading from "../components/Loading";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (value, formikBag) => {
    try {
      setIsLoading(true);
      const currentUser = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );

      await updateProfile(auth.currentUser, {
        displayName: value.userName,
      });
      await setDoc(doc(firebaseDb, "users", currentUser.user.uid), {
        uid: currentUser.user.uid,
        name: currentUser.user.displayName,
        email: currentUser.user.email,
        avatar: "",
        avatarPath: "",
        createdAt: Timestamp.fromDate(new Date()),
        friends: [],
      });
      setIsLoading(false);
      navigate("/", { replace: true });
    } catch (err) {
      setIsLoading(false);
      formikBag.setFieldError("email", "Invalid Email");
      formikBag.setFieldError("password,", "Invalid Password");
      console.log(err);
    }
  };

  function signupValidationSchema() {
    return Yup.object({
      userName: Yup.string().required("Username required"),
      email: Yup.string().required("Email required").email(),
      password: Yup.string().required("Password required").min(6),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords does not match"
      ),
    });
  }

  if (isLoading) return <Loading />;
  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="hidden md:flex md:visible w-1/2 h-screen bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Firebase Messenger
          </h1>
          <p className="text-white mt-1">A Encrypted chat app using firebase</p>
        </div>
      </div>
      <div className="flex w-1/2 h-screen justify-center items-center bg-white">
        <Formik
          className="bg-white"
          initialValues={{
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(value, formikbag) => handleSubmit(value, formikbag)}
          validationSchema={signupValidationSchema}
        >
          <Form className="bg-white">
            <h1 className="text-gray-800 text-center font-bold text-4xl mb-4">
              Sign Up
            </h1>

            <div className="my-3">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  className="pl-2 outline-none border-none"
                  type="text"
                  name="userName"
                  placeholder="UserName"
                />
              </div>
              <ErrorMessage name="userName">
                {(msg) => (
                  <span className="text-sm text-red-500 pl-2">{msg}</span>
                )}
              </ErrorMessage>
            </div>

            <div className="my-3">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  className="pl-2 outline-none border-none"
                  type="email"
                  name="email"
                  placeholder="Email "
                />
              </div>
              <ErrorMessage name="email">
                {(msg) => (
                  <span className="text-sm text-red-500 pl-2">{msg}</span>
                )}
              </ErrorMessage>
            </div>

            <div className="my-3">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  className="pl-2 outline-none border-none"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <ErrorMessage name="password">
                {(msg) => (
                  <span className="text-sm text-red-500 ml-2 ">{msg}</span>
                )}
              </ErrorMessage>
            </div>

            <div className="my-3 ">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  className="pl-2 outline-none border-none"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                />
              </div>
              <ErrorMessage name="confirmPassword">
                {(msg) => <span className="text-sm text-red-500 ">{msg}</span>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              className="block w-full bg-blue-600 hover:bg-blue-800 my-4 py-2 rounded-2xl text-white font-semibold mb-2"
            >
              Sign Up
            </button>
            <p className="text-sm text-center my-2 font-bold text-red-500 hover:text-red-800 cursor-pointer">
              <a href="/resetPassword">Forgot Password ?</a>
            </p>
            <p className="font-bold text-center my-2 text-green-600 hover:text-green-800 cursor-pointer">
              <a href="/login">Sign In</a>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
