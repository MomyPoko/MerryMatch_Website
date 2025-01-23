"use client";

import Link from "next/link";
import * as yup from "yup";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaRegGrinStars } from "react-icons/fa";
import { ImSleepy } from "react-icons/im";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const { status } = useSession();

  const todoSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Please enter email"),
    password: yup.string().required("Please enter password"),
  });

  const handleSubmit = async (
    values: LoginForm,
    { setSubmitting, setErrors }: FormikHelpers<LoginForm>
  ) => {
    const { email, password } = values;

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // console.log("Response client", response);

    if (!password) {
      setErrors({ password: "Password is invalid" });
      return;
    }

    if (response?.error) {
      setErrors({ email: "Your email not found" });
    } else if (response?.ok) {
      router.push("/");
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={todoSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="w-full h-full flex justify-center items-center">
          <div className="w-[1150px] flex justify-between items-center">
            <img src="/images/image-loginpage.png" alt="image-loginpage" />
            <div className="w-[455px] flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[8px]">
                <div className="text-beige-700 text-[14px] font-[600]">
                  Login
                </div>
                <div
                  className="text-purple-500 text-[46px] font-[800]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Welcome back to Merry Match
                </div>
              </div>
              <div className="flex flex-col gap-[40px]">
                <div className="relative flex flex-col gap-[4px]">
                  <div>Username or Email</div>
                  <Field
                    type="text"
                    name="email"
                    placeholder="Enter Username or Email"
                    className="border-gray-400 border-[1px] p-[12px_16px_12px_12px] w-[100%] outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="absolute bottom-[-25px] text-red-500"
                  />
                </div>
                <div className="relative flex flex-col gap-[4px]">
                  <div className="flex justify-between">
                    <span>Password</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <ImSleepy className="text-[20px]" />
                      ) : (
                        <FaRegGrinStars className="text-[20px]" />
                      )}
                    </button>
                  </div>

                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    className="border-gray-400 border-[1px] p-[12px_16px_12px_12px] w-[100%] outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="absolute bottom-[-25px] text-red-500"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="p-[12px_24px_12px_24px] text-white text-[16px] font-[700] bg-red-500 rounded-[99px]"
                >
                  Log in
                </button>
                <span>
                  Don’t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-red-500 font-[700]"
                  >
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPage;
