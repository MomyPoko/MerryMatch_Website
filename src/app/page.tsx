"use client";

import HomePage from "@/components/homepage/Home";
import Navbar from "@/components/navbar/Navbar";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

function Home() {
  // const session = await getServerSession();
  const { status } = useSession();

  // console.log("hi: ", status);

  if (status === "loading") {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <HomePage />
    </>
  );
}

export default Home;
