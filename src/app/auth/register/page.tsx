"use client";

import RegisterPage from "@/components/register/RegisterPage";
import Navbar from "@/components/navbar/Navbar";

function Register() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-none h-[88px]">
        <Navbar />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <RegisterPage />
      </div>
    </div>
  );
}

export default Register;
