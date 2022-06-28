import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../configs/firebase";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const navigate = useNavigate();

  function forgotPasswordValidationSchema() {
    return Yup.object({
      email: Yup.string().required("Email required").email(),
    });
  }

  const handleSubmit = async (value, formikBag) => {
    try {
      await sendPasswordResetEmail(auth, value.email);
      window.alert(`Email is sent to ${value.email}`);
      navigate("/login", { replace: true });
    } catch (err) {
      formikBag.setFieldError("email", "Invalid Email");
    }
  };

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
          initialValues={{ email: "" }}
          onSubmit={(value, formikBag) => handleSubmit(value, formikBag)}
          validationSchema={forgotPasswordValidationSchema}
        >
          <Form className="bg-white">
            <h1 className="text-gray-800 text-center font-bold text-4xl mb-4">
              Forgot Password
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

            <button
              type="submit"
              className="block w-full bg-red-600 hover:bg-red-800 my-4 py-2 rounded-2xl text-white font-semibold mb-2"
            >
              Forgot Password
            </button>
            <p className="text-sm text-center my-2 font-bold text-indigo-500 hover:text-indigo-800 cursor-pointer">
              <a href="/signup">SignUp</a>
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
