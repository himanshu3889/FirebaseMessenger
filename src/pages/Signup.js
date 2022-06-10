import React from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex ">
      <div className="flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 i justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">GoFinance</h1>
          <p className="text-white mt-1">
            The most popular peer to peer lending at SEA
          </p>
          <button
            type="submit"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            Read More
          </button>
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center bg-white">
        <Formik
          className="bg-white"
          initialValues={{ email: "", password: "" }}
          onSubmit={(value, formikBag) => {
            const auth = getAuth(firebaseApp);
            createUserWithEmailAndPassword(auth, value.email, value.password)
              .then((res) => {
                navigate("/", { replace: true });
              })
              .catch((e) => {
                formikBag.setFieldError("email", "Invalid Email");
                formikBag.setFieldError("password,", "Invalid Password");
              });
          }}
          validationSchema={Yup.object({
            email: Yup.string().required("Email required").email(),
            password: Yup.string().required("Password required").min(6),
            confirmPassword: Yup.string().oneOf(
              [Yup.ref("password"), null],
              "Passwords does not match"
            ),
          })}
        >
          <Form className="bg-white">
            <h1 className="text-gray-800 text-center font-bold text-4xl mb-4">
              Sign Up
            </h1>

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
              className="block w-full bg-blue-600 my-4 py-2 rounded-2xl text-white font-semibold mb-2"
            >
              Sign Up
            </button>
            <p className="text-sm text-center my-2 text-red-500 hover:text-red-800 cursor-pointer">
              <a href="">Forgot Password ?</a>
            </p>
            <p className="font-bold text-center my-2 text-green-500 hover:text-green-800 cursor-pointer">
              <a href="/login">Sign In</a>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
