"use client";

import MatchingPage from "@/components/matching/Matching";
import Navbar from "@/components/navbar/Navbar";

function Matching() {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex-none h-[88px]">
        <Navbar />
      </div>
      <div className="flex-1 flex overflow-hidden">
        <MatchingPage />
      </div>
    </div>
  );
}

export default Matching;
