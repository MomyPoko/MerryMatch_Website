"use client";

import LoginPage from "@/components/login/LoginPage";
import Navbar from "@/components/navbar/Navbar";

function login() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-none h-[88px]">
        <Navbar />
      </div>
      <div className="flex-1 h-full">
        <LoginPage />
      </div>
    </div>
  );
}

export default login;
