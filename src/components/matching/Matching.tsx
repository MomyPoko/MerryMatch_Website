"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill } from "react-icons/bs";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Picker from "emoji-picker-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import user from "@/models/user";
import "@/app/globals.css";

interface UserData {
  _id: string;
  id: string;
  name: string;
  dateOfBirth: string;
  image: { url: string }[];
}

interface MatchingData {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: { url: string; publicId: string }[];
  status: "pending" | "matched" | "rejected";
}

const MatchingPage = () => {
  const [userData, setUserData] = useState<UserData[] | null>(null);
  const [matchingData, setMatchingData] = useState<MatchingData[]>([]);
  const [inputMsg, setInputMsg] = useState<{ [key: string]: string }>({});
  const [messages, setMessages] = useState<{ [key: string]: any[] }>({});
  const [selectedSexIdent, setSelectedSexIdent] = useState<string[]>([]);
  const [sexIdent, setSexIdent] = useState<string[]>([]);
  const [noUsersFoundMessage, setNoUsersFoundMessage] = useState<string | null>(
    null
  );

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<MatchingData | null>(
    null
  );

  const [activeDiscoverIndex, setActiveDiscoverIndex] = useState<number>(0);
  const [activeMerryIndex, setActiveMerryIndex] = useState<number>(0);
  const [activeChatIndex, setActiveChatIndex] = useState<number>(0);

  const [ageRange, setAgeRange] = useState<number[]>([18, 50]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<number[]>([18, 50]);
  const [pages, setPages] = useState<"matching" | "chatting" | "merrymatch">(
    "matching"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const { data: session } = useSession();

  // const SOCKET_SERVER_URL = "http://localhost:4000";

  const swiperRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<Socket | null>(null);

  const currentUserId = session?.user?.id;

  let sex_Identities: Array<string> = ["Male", "Female", "Other"];

  const createMatching = async (
    userId: string,
    status: "pending" | "rejected"
  ) => {
    try {
      const response = await axios.post("/api/matching/index", {
        requesterId: currentUserId,
        receiverId: userId,
        status,
      });

      setUserData(
        (prevUserData) =>
          prevUserData?.filter((user) => user._id !== userId) || null
      );

      getMatchingData();
      getUserData();

      console.log("Matching created: ", response.data);
    } catch (error) {
      console.log("Error creating matching: ", error);
    }
  };

  // func only show all data if user have status
  const getMatchingData = async () => {
    try {
      const response = await axios.get("/api/users/index", {
        params: { fetchMatches: true },
      });
      setMatchingData(response.data);
      setNoUsersFoundMessage(null);

      // console.log("Matching data fetch Matchingpage: ", response.data);
    } catch (error) {
      console.log("Error fetching matching: ", error);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get("/api/users/index", {
        params: {
          sexIdent: sexIdent.join(","),
          minAge: selectedAgeRange[0],
          maxAge: selectedAgeRange[1],
        },
      });

      const filteredUsers = response.data.filter(
        (user: UserData) => user._id !== currentUserId
      );

      if (filteredUsers.length === 0) {
        setNoUsersFoundMessage("No users match your criteria.");
        setUserData(null);
      } else {
        setUserData(filteredUsers);
        setNoUsersFoundMessage(null);
      }

      // console.log("Filtered Users Data: ", filteredUsers);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNoUsersFoundMessage("User not found");
        setUserData(null); // หากไม่พบผู้ใช้
      } else {
        console.log("Error fetching users data: ", error);
      }
    }
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleNextSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrevSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleCheckboxChange = (gender: string) => {
    // เลือก/ยกเลิกเลือกเพศ
    setSelectedSexIdent((prev) =>
      prev.includes(gender)
        ? prev.filter((sex) => sex !== gender)
        : [...prev, gender]
    );
  };

  const handleSearch = () => {
    setSexIdent([...selectedSexIdent]);
    setAgeRange(selectedAgeRange);
  };

  const handleClear = () => {
    // Reset parameters
    setSelectedSexIdent([]);
    setSexIdent([]);
    setSelectedAgeRange([18, 50]);
    setAgeRange([18, 50]);
    getUserData();
  };

  const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
    setSelectedAgeRange(newValue as number[]);
  };

  const handleInputAgeRangeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...ageRange];
    newRange[index] = Number(event.target.value);
    setSelectedAgeRange(newRange as number[]);
  };

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji: any) => {
    const selectedEmoji = emoji?.emoji || emoji?.native || "";

    if (selectedEmoji) {
      setInputMsg((prevMsg) => prevMsg + selectedEmoji);
    }
  };

  const handleStartConversation = async (user: MatchingData, index: number) => {
    setSelectedUserId(user._id);
    setSelectedChatUser(user);
    setActiveMerryIndex(index);
    setActiveChatIndex(index);
    setPages("chatting");

    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }

    try {
      const response = await axios.get("/api/messages/index", {
        params: { from: currentUserId, to: user._id },
      });

      setMessages((prev) => ({
        ...prev,
        [user._id]: response.data,
      }));

      setInputMsg((prev) => ({
        ...prev,
        [user._id]: "",
      }));

      // console.log("Get data message: ", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendChat = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedUserId || !currentUserId) {
      console.error("Error: selectedUserId or currentUserId is undefined");
      return;
    }

    const messageText = inputMsg[selectedUserId]?.trim();
    if (!messageText) {
      console.error("Error: Message content is empty");
      return;
    }

    try {
      const response = await axios.post("/api/messages/index", {
        from: currentUserId,
        to: selectedUserId,
        message: messageText,
      });

      if (socket.current) {
        socket.current.emit("sendMessage", {
          from: currentUserId,
          to: selectedUserId,
          msg: { text: messageText },
        });

        console.log("Message sent via socket:", {
          from: currentUserId,
          to: selectedUserId,
          text: messageText,
        });

        setMessages((prev) => ({
          ...prev,
          [selectedUserId]: [
            ...(prev[selectedUserId] || []),
            {
              fromSelf: true,
              message: { text: messageText },
            },
          ],
        }));

        setInputMsg((prev) => ({
          ...prev,
          [selectedUserId]: "",
        }));
      } else {
        console.error("Socket connection not established");
      }

      // console.log("Message sent: ", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    getMatchingData();

    if (session) {
      getUserData();
    }

    if (sexIdent.length > 0) {
      getUserData();
    }

    if (pages === "matching") {
      getUserData();
      setActiveDiscoverIndex(0);
      setActiveMerryIndex(0);
      setActiveChatIndex(0);
      swiperRef.current?.swiper?.slideTo(activeDiscoverIndex);
    }

    if (pages === "merrymatch" && activeDiscoverIndex !== null) {
      setActiveDiscoverIndex(0);
      setActiveChatIndex(0);
      swiperRef.current?.swiper?.slideTo(activeMerryIndex);
    }

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (messages) {
      console.log("Messages state updated:", messages);
    }
  }, [
    pages,
    activeMerryIndex,
    activeChatIndex,
    selectedChatUser,
    sexIdent,
    ageRange,
    session,
    messages,
    selectedUserId,
  ]);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current?.id);
    });

    socket.current.on("receiveMessage", (data) => {
      console.log("Message received in client:", data);

      setMessages((prev) => ({
        ...prev,
        [data.from]: [
          ...(prev[data.from] || []),
          { fromSelf: false, message: { text: data.msg.text } },
        ],
      }));
    });

    return () => {
      socket.current?.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  useEffect(() => {
    if (currentUserId && socket.current) {
      socket.current.emit("addUser", currentUserId);
      console.log(`User added to socket: ${currentUserId}`);
    }
  }, [currentUserId]);

  return (
    <div className="w-full h-full flex overflow-hidden">
      {userData && (
        <>
          <div className="w-[20%] h-full bg-gray-100 flex flex-col">
            <div className="py-[30px] w-full border-b-[1px] border-gray-300 flex justify-center items-center">
              <button
                onClick={() => setPages("matching")}
                className={`p-[24px] w-[282px] h-[187px] border-[1px] border-gray-400 text-center bg-gray-200 rounded-[16px] flex flex-col justify-center items-center gap-[4px] ${
                  pages === "matching" ? "border-purple-500" : ""
                }`}
              >
                <img
                  src="/images/icon-findheart.png"
                  alt="icon-findheart"
                  className="w-[60px] h-[60px]"
                />
                <div className="text-[24px] font-[700] text-red-600">
                  Discover New Match
                </div>
                <div className="text-[14px] font-[500] text-gray-700">
                  Start find and Merry to get know and connect with new friend!
                </div>
              </button>
            </div>
            <div className="w-full py-[24px] flex justify-center">
              <div className="w-[281px] h-full flex flex-col justify-center gap-[16px]">
                <div className="text-[24px] text-gray-900 font-[700]">
                  Merry Match!
                </div>

                {matchingData && matchingData.length > 0 ? (
                  <div className="carousel gap-[12px]">
                    {matchingData.map((matchdata, index_matchdata) => (
                      <button
                        onClick={() => {
                          setActiveMerryIndex(index_matchdata);
                          setPages("merrymatch");
                        }}
                        key={index_matchdata}
                        className="carousel-item"
                      >
                        <div className="relative w-[100px] h-[100px]">
                          <img
                            src={matchdata.image[0].url}
                            className={`w-full h-full rounded-[24px] ${
                              pages === "merrymatch" &&
                              activeMerryIndex === index_matchdata
                                ? "border-[1px] border-purple-500"
                                : ""
                            }`}
                          />
                          <img
                            src="/images/icon-doubleheart.png"
                            className="absolute bottom-0 right-[-2px]"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[14px] font-[400] text-gray-900">
                    No matched users found.
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center">
              <div className="pt-[24px] w-[281px] flex flex-col gap-[16px]">
                <div className="text-[24px] font-[700] text-gray-900">
                  Chat with Merry Match
                </div>

                {matchingData && (
                  <div className="carousel carousel-vertical rounded-box h-[144px]">
                    {matchingData.map((matchdata, index_matchdata) => (
                      <div
                        key={index_matchdata}
                        className="pb-[10px] carousel-item"
                      >
                        <button
                          onClick={() => {
                            handleStartConversation(matchdata, index_matchdata);
                          }}
                          className={`px-[12px] py-[16px] w-full bg-gray-100 border-[1px]  rounded-[16px] flex gap-[12px] ${
                            pages === "chatting" &&
                            activeChatIndex === index_matchdata
                              ? "border-purple-500"
                              : ""
                          }`}
                        >
                          <img
                            src={matchdata.image[0].url}
                            className="w-[60px] h-[60px] rounded-[99px]"
                          />
                          <div className="flex flex-col items-start gap-[8px]">
                            <div className="text-[16px] font-[400] text-gray-900">
                              {matchdata.name}
                            </div>
                            <div className="text-[14px] font-[500] text-gray-700">
                              current chat
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {pages === "matching" || pages === "merrymatch" ? (
            <>
              <div className="w-[65%] h-full bg-BG">
                {pages === "matching" ? (
                  userData && userData.length > 0 ? (
                    <div className="w-full h-full flex flex-col justify-start items-center">
                      <Swiper
                        slidesPerView={1.75}
                        centeredSlides={true}
                        // spaceBetween={180}
                        breakpoints={{
                          1440: {
                            spaceBetween: 160,
                          },
                          1920: {
                            spaceBetween: 200,
                          },
                        }}
                        onSlideChange={(swiper) =>
                          setActiveDiscoverIndex(swiper.activeIndex)
                        }
                        ref={swiperRef}
                        className="w-[100%] h-[80%] overflow-hidden"
                      >
                        {userData.map((data, index_data) => (
                          <SwiperSlide key={index_data}>
                            <div
                              className={`relative pt-[10%] w-[100%] h-[90%] transition-all duration-500 ${
                                activeDiscoverIndex === index_data
                                  ? "scale-100 z-20"
                                  : "scale-90 z-10 opacity-30"
                              }`}
                            >
                              <img
                                src={data.image[0].url}
                                alt={data.name}
                                className="w-[100%] h-[100%] rounded-[32px]"
                              />

                              {activeDiscoverIndex === index_data && (
                                <>
                                  <div className="absolute bottom-0 bg-gradient-to-t from-[#390741] to-[070941]/0 px-[6%] w-full h-[30%] text-white rounded-[30px] flex justify-between items-center">
                                    <div className="flex items-center gap-[16px]">
                                      <span className="flex gap-[8px]">
                                        <span className="text-[32px] font-[700]">
                                          {data.name}
                                        </span>
                                        <span className="text-[32px] font-[700]">
                                          {calculateAge(data.dateOfBirth)}
                                        </span>
                                      </span>

                                      <button className="w-[32px] h-[32px] text-[20px] bg-white/20 rounded-[100%] flex justify-center items-center active:text-[18px]">
                                        <AiFillEye />
                                      </button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        onClick={handlePrevSlide}
                                        className="w-[40px] text-[24px] active:text-[23px]"
                                      >
                                        <FaArrowLeft />
                                      </button>
                                      <button
                                        onClick={handleNextSlide}
                                        className="w-[40px] text-[24px] active:text-[23px]"
                                      >
                                        <FaArrowRight />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="absolute bottom-[-40px] z-100 w-[100%] flex justify-center">
                                    <div className="flex gap-[24px]">
                                      <button
                                        onClick={() =>
                                          createMatching(data._id, "rejected")
                                        }
                                        className="w-[80px] h-[80px] text-[64px] text-gray-700 bg-white rounded-[24px] flex justify-center items-center active:text-[63px]"
                                      >
                                        <IoClose />
                                      </button>
                                      <button
                                        onClick={() =>
                                          createMatching(data._id, "pending")
                                        }
                                        className="w-[80px] h-[80px] text-[48px] text-red-500 bg-white rounded-[24px] flex justify-center items-center active:text-[47px]"
                                      >
                                        <IoHeart />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="flex gap-[10px]">
                        <span className="text-gray-700 text-[16px] font-[400]">
                          Merry limit today
                        </span>
                        <span className="text-red-400 text-[16px] font-[400]">
                          {activeDiscoverIndex + 1}/20
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <p className="text-2xl font-bold text-red-800">
                        {noUsersFoundMessage}
                      </p>
                    </div>
                  )
                ) : pages === "merrymatch" ? (
                  <div className="w-full h-full flex flex-col justify-start items-center">
                    <Swiper
                      slidesPerView={1.75}
                      centeredSlides={true}
                      breakpoints={{
                        1440: {
                          spaceBetween: 160,
                        },
                        1920: {
                          spaceBetween: 200,
                        },
                      }}
                      onSlideChange={(swiper) =>
                        setActiveMerryIndex(swiper.activeIndex)
                      }
                      ref={swiperRef}
                      className="w-[100%] h-[80%] overflow-hidden"
                    >
                      {matchingData.map((data, index_data) => (
                        <SwiperSlide key={index_data}>
                          <div
                            className={`relative pt-[10%] w-[100%] h-[90%] transition-all duration-500 ${
                              activeMerryIndex === index_data
                                ? "scale-100 z-20"
                                : "scale-90 z-10 opacity-30"
                            }`}
                          >
                            <img
                              src={data.image[0].url}
                              alt={data.name}
                              className="w-[100%] h-[100%] rounded-[32px]"
                            />

                            {activeMerryIndex === index_data && (
                              <div className="absolute bottom-0 bg-gradient-to-t from-[#390741] to-[070941]/0 px-[6%] w-full h-[35%] rounded-[30px] flex flex-col justify-start items-center gap-[40px]">
                                <img
                                  src="/images/image-merrymatch.png"
                                  className="w-[220px]"
                                />
                                <div>
                                  <button
                                    onClick={() =>
                                      handleStartConversation(data, index_data)
                                    }
                                    className="bg-red-100 px-[24px] py-[12px] text-red-600 text-[16px] font-[700] rounded-[99px] active:scale-95"
                                  >
                                    Start Conversation
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : null}
              </div>

              <div className="w-[15%] h-full bg-gray-100">
                <div className="pt-[20px] w-full flex justify-center">
                  <div className="w-[200px] h-[400px] flex flex-col gap-[60px]">
                    <div className="flex flex-col gap-[16px]">
                      <div className="text-[16px] font-[700] text-gray-900">
                        Sex you interest
                      </div>
                      <div className="flex flex-col gap-[16px]">
                        {sex_Identities.map((genders, index_sex) => {
                          return (
                            <div key={index_sex} className="flex gap-[12px]">
                              <input
                                type="checkbox"
                                checked={selectedSexIdent.includes(genders)}
                                onChange={() => handleCheckboxChange(genders)}
                                className="checkbox checkbox-secondary"
                              />
                              <div className="text-[16px] font-[500] text-gray-700">
                                {genders}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[16px]">
                      <div className="text-[16px] font-[700] text-gray-900">
                        Age Range
                      </div>
                      <div className="w-full flex justify-center">
                        <Box sx={{ width: "95%" }}>
                          <Slider
                            getAriaLabel={() => "Age range"}
                            value={selectedAgeRange}
                            onChange={handleAgeRangeChange}
                            valueLabelDisplay="auto"
                            min={18}
                            max={50}
                            sx={{
                              color: "pink",
                              "& .MuiSlider-thumb": {
                                width: "11px",
                                height: "11px",
                                border: "2px solid #A62D82",
                                backgroundColor: "#DF89C6",
                              },
                              "& .MuiSlider-track": {
                                backgroundColor: "#A62D82",
                              },
                            }}
                          />
                        </Box>
                      </div>

                      <div className="flex justify-center items-center gap-[10px]">
                        <input
                          type="text"
                          className="w-[100%] h-[48px] pl-[12px] rounded-[8px] outline-[1px] outline-purple-500"
                          value={selectedAgeRange[0]}
                          onChange={(e) => handleInputAgeRangeChange(e, 0)}
                        />
                        <span> - </span>
                        <input
                          type="text"
                          className="w-[100%] h-[48px] pl-[12px] rounded-[8px] outline-[1px] outline-purple-500"
                          value={selectedAgeRange[1]}
                          onChange={(e) => handleInputAgeRangeChange(e, 1)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[100%] border-t-[1px] border-gray-300 flex justify-center gap-[16px]">
                  <div className="pt-[20px] h-[80px] flex justify-center items-center gap-[16px]">
                    <button
                      onClick={handleClear}
                      className="w-[40px] h-[20px] text-[16px] font-[700] text-red-500"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSearch}
                      className="w-[99px] h-[48px] text-[16px] font-[700] text-white bg-red-500 rounded-[99px]"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : pages === "chatting" && selectedChatUser && selectedUserId ? (
            <div className="w-[80%] h-full bg-BG flex flex-col">
              <div className="px-4 h-[96px] flex items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img
                      src={selectedChatUser?.image[0]?.url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-white text-xl">
                      {selectedChatUser?.name}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 px-4 pt-2 pb-[20px] overflow-y-auto scrollbar">
                {(messages[selectedUserId] || []).map(
                  (message, index_message) => (
                    <div
                      key={index_message}
                      ref={
                        index_message ===
                        (messages[selectedUserId]?.length || 0) - 1
                          ? scrollRef
                          : null
                      }
                      className={`flex mt-5 ${
                        message.fromSelf ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!message.fromSelf && (
                        <div className="flex items-center gap-4 mt-5">
                          <div className="w-12 h-12">
                            <img
                              src={selectedChatUser?.image[0].url}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <span className="px-5 py-2 bg-purple-200 text-black rounded-[30px]">
                            {message.message?.text}
                          </span>
                        </div>
                      )}

                      {message.fromSelf && (
                        <div className="flex justify-end mt-5">
                          <span className="px-5 py-2 bg-purple-600 text-white rounded-[30px]">
                            {message.message?.text}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="w-full h-[80px] border-gray-800 border-t-[1px] flex justify-center items-center gap-[24px]">
                <div className="relative">
                  <div className="w-[48px] h-[48px] rounded-[99px] flex flex-col justify-center items-center bg-red-500">
                    <BsEmojiSmileFill
                      onClick={handleEmojiPickerHideShow}
                      className="rounded-full text-white text-[24px] flex justify-center items-center cursor-pointer"
                    />
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute bottom-[70px] left-0 overflow-hidden bg-white rounded-lg shadow-lg z-50">
                      <Picker
                        onEmojiClick={handleEmojiClick}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <form onSubmit={handleSendChat} className="w-[80%] flex">
                  <input
                    value={inputMsg[selectedUserId] || ""}
                    onChange={(e) =>
                      setInputMsg((prev) => ({
                        ...prev,
                        [selectedUserId]: e.target.value,
                      }))
                    }
                    type="text"
                    placeholder="Message here...."
                    className="px-[14px] w-full h-[48px] bg-BG text-white rounded-[30px] outline-none"
                  />
                  <button className="w-[48px] h-[48px] rounded-[99px] flex justify-center items-center bg-red-500">
                    <RiSendPlaneFill className="text-white text-[24px]" />
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MatchingPage;
