"use client";

import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import Footer from "@/components/footer/Footer";

const profilePage = () => {
  return (
    <div className="m-0 p-0">
      <Navbar />
      <Profile />
      <Footer />
    </div>
  );
};

export default profilePage;
