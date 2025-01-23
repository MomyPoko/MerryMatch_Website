"use client";

import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cardData = [
  {
    emoji: "😎",
    title: "Upload your cool picture",
  },
  {
    emoji: "🤩",
    title: "Explore and find the one you like",
  },
  {
    emoji: "🥳",
    title: "Showcase your skills",
  },
  {
    emoji: "😘",
    title: "Capture the moment",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleStartMatching = () => {
    if (status === "authenticated") {
      // หากผู้ใช้ล็อกอินอยู่แล้ว ให้นำไปที่หน้า matching
      router.push("/matching");
    } else {
      // หากผู้ใช้ยังไม่ได้ล็อกอิน ให้นำไปที่หน้า login
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  return (
    <div className="p-0 m-0">
      <div className="relative h-[758px] bg-BG flex justify-center">
        <img
          src="/images/emoji-background1.png"
          alt="emoji-background1"
          className="absolute w-full max-w-full left-0 top-[10%]"
        />
        <img
          src="/images/image-firstpage1.png"
          alt="image-firstpage1"
          className="absolute max-w-full left-[70%]"
        />
        <img
          src="/images/image-firstpage2.png"
          alt="image-firstpage2"
          className="absolute max-w-full left-[10%] bottom-0"
        />
        <div className="absolute w-[360px] text-white flex flex-col justify-center items-center gap-[60px] top-[25%]">
          <div className="flex flex-col justify-center items-center gap-[24px]">
            <div className="text-[60px] text-center font-[900]">
              Make the first ‘Merry’
            </div>
            <div className="text-[20px] text-center font-[600]">
              If you feel lonely, let’s start meeting new people in your area!
              Dont’t forget to get Merry with us
            </div>
          </div>

          <button
            onClick={handleStartMatching}
            className="p-[12px_24px_12px_24px] font-[700] bg-[#C70039] rounded-[99px] active:scale-95"
          >
            Start matching!
          </button>
        </div>
      </div>
      <div
        id="Why-Merry-Match"
        className="h-[533px] bg-BG flex justify-center items-center"
      >
        <div className="flex gap-[30px]">
          <div className="w-[550px] flex flex-col gap-[40px]">
            <div className="text-[46px] text-purple-300 font-[800] leadind-[57px]">
              Why Merry Match?
            </div>
            <div className="h-full flex flex-col justify-between">
              <div className="text-[20px] text-[white] font-[600]">
                Merry Match is a new generation of online dating website for
                everyone
              </div>
              <div className="text-gray-100">
                Whether you’re committed to dating, meeting new people,
                expanding your social network, meeting locals while traveling,
                or even just making a small chat with strangers.
              </div>
              <div className="text-gray-100">
                This site allows you to make your own dating profile, discover
                new people, save favorite profiles, and let them know that
                you’re interested
              </div>
            </div>
          </div>
          <img
            src="/images/image-background1.png"
            alt="image-background1"
            className="max-w-full"
          />
        </div>
      </div>
      <div
        id="How-to-Merry"
        className="h-[622px] bg-BG flex justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center gap-[40px]">
          <div className="text-[46px] text-purple-300 font-[800] leadind-[57px]">
            How to Merry
          </div>
          <div className="flex gap-[24px]">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="p-[32px] w-[260px] h-[350px] bg-purple-900 rounded-[40px] flex flex-col items-center gap-[40px] transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-purple-900/50"
              >
                <span className="w-[120px] h-[120px] bg-purple-600 rounded-[100%] text-[55px] flex justify-center items-center">
                  {card.emoji}
                </span>
                <div className="p-[2px] flex flex-col gap-[12px]">
                  <div className="text-[24px] text-[white] text-center font-[700]">
                    {card.title}
                  </div>
                  <div className="text-gray-500 text-center">
                    Lorem ipsum is a placeholder text
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[570px] bg-BG flex justify-center items-center">
        <div className="relative w-[1200px] h-[370px] bg-gradient-to-l from-purple-500 to-red-600 rounded-[32px] flex flex-col justify-center items-center gap-[32px]">
          <img
            src="/images/emoji-background2.png"
            alt="emoji-background2"
            className="absolute w-full z-0"
          />
          <div
            className="relative z-0 w-[590px] text-[46px] text-white text-center font-[800]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Let’s start finding <br /> and matching someone new
          </div>

          <button
            onClick={handleStartMatching}
            className="relative z-0 p-[12px_24px_12px_24px] text-red-600 font-[700] bg-red-100 rounded-[99px] active:scale-95"
          >
            Start matching!
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
