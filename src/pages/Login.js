import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseDb } from "../configs/firebase";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { doc, updateDoc } from "firebase/firestore";
import Loading from "../components/Loading";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (value, formikBag) => {
    try {
      setIsLoading(true);
      const currentUser = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
      await updateDoc(doc(firebaseDb, "users", currentUser.user.uid), {
        isOnline: true,
      });
      navigate("/", { replace: true });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false)
      formikBag.setFieldError("email", "Invalid Email");
      formikBag.setFieldError("password,", "Invalid Password");
    }
  };

  function signInValidationSchema() {
    return Yup.object({
      email: Yup.string().required("Email required").email(),
      password: Yup.string().required("Password required").min(6),
    });
  }

  if (isLoading) return <Loading />;
  return (
    <div className="h-screen flex">
      <div className="flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Firebase Messenger
          </h1>
          <p className="text-white mt-1">A Encrypted chat app using firebase</p>
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center bg-white">
        <Formik
          className="bg-white"
          initialValues={{ email: "", password: "" }}
          onSubmit={(value, formikBag) => handleSignIn(value, formikBag)}
          validationSchema={() => signInValidationSchema()}
        >
          <Form>
            <h1 className="text-gray-800 text-center font-bold text-4xl mb-4">
              Sign In
            </h1>

            <div className="my-3">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  type="email"
                  name="email"
                  className="pl-2 outline-none border-none"
                  placeholder="Email Address"
                />
              </div>
              <ErrorMessage name="email">
                {(msg) => (
                  <span className="text-sm text-red-500 ml-2">{msg}</span>
                )}
              </ErrorMessage>
            </div>

            <div className="my-3">
              <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
                <Field
                  type="password"
                  name="password"
                  className="pl-2 outline-none border-none"
                  placeholder="Password"
                />
              </div>
              <ErrorMessage name="password">
                {(msg) => (
                  <span className="text-sm text-red-500 ml-2">{msg}</span>
                )}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              className="block w-full bg-green-600 hover:bg-green-800 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
            >
              Login
            </button>

            <p className="text-sm my-2 text-center font-bold text-red-500 hover:text-red-800 cursor-pointer">
              <a href="/resetPassword">Forgot Password ?</a>
            </p>
            <p className="font-bold text-center my-2 text-indigo-500 hover:indigo-800 cursor-pointer">
              <a href="/signup">Sign Up</a>
            </p>
            <div className="flex justify-center divide-x divide-dashed mt-4"></div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
