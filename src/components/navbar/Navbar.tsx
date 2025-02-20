"use client";

import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { IoIosCube } from "react-icons/io";
import { FaTriangleExclamation } from "react-icons/fa6";
import { AiFillHeart } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { IoHeart } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface MatchingRequest {
  _id: string;
  username: string;
  name: string;
  state: string;
  country: string;
  sexIdent: string;
  sexPref: string;
  racialPref: string;
  meeting: string;
  hobbies: string;
  image: { url: string; publicId: string }[];
  dateOfBirth: string;
  status?: "pending" | "matched" | "rejected";
}

// interface MatchingData {
//   id: string;
//   _id: string;
//   requesterUser: MatchingRequest;
//   receiverUser: MatchingRequest[];
// }

const Navbar = () => {
  const [selectedUser, setSelectedUser] = useState<MatchingRequest | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { data: clientSession, status } = useSession();
  const swiperRef = useRef<any>(null);
  // const socket = useRef<Socket | null>(null);
  const router = useRouter();

  const userImage = clientSession?.user?.image?.[0]?.url;
  const userName = clientSession?.user?.name;

  // if (status === "loading") {
  //   return <div className="h-[88px] bg-white shadow-md"></div>;
  // }

  const getNotifications = async () => {
    try {
      const response = await axios.get("/api/notification/index");

      console.log("Notifications Data:", response.data);

      // อัปเดต state ของ notifications ให้แสดงผลตอนกด FaBell
      setNotifications(response.data);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  const updateMatching = async (targetUserId: string, status: string) => {
    try {
      const currentUserId = clientSession?.user?.id;
      const currentUserName = clientSession?.user?.name;

      if (!currentUserId) {
        console.error("User is not authenticated.");
        return;
      }

      const updatedStatusMatching = await axios.put(
        `/api/matching/${currentUserId}`,
        {
          targetUserId,
          status,
        }
      );

      const existingNotification = notifications.find(
        (n) => n.sender._id === targetUserId && n.type === "matchRequest"
      );

      if (existingNotification) {
        // ถ้า Reject ให้เปลี่ยนข้อความเป็น "You rejected user2"
        if (status === "rejected") {
          await axios.put(`/api/notification/${existingNotification._id}`, {
            newMessage: `You rejected '${existingNotification.sender.name}'`,
            type: "rejected",
          });
        }
        // ถ้า Match ให้เปลี่ยนข้อความเป็น "You and user2 Merry"
        else if (status === "matched") {
          await axios.put(`/api/notification/${existingNotification._id}`, {
            newMessage: `You and '${existingNotification.sender.name}' Merry`,
            type: "matchSuccess",
          });

          // แจ้งเตือน user2 ว่าถูก Match กลับ
          await axios.post("/api/notification/index", {
            senderId: currentUserId,
            receiverId: targetUserId,
            type: "matchResponse",
            message: `'${currentUserName}' Merry you back!`,
          });
        }
      }

      // console.log("Update Status Match data: ", updatedStatusMatching);
      // console.log("Create Notification data: ", createdNotification);

      setNotifications((prev) =>
        prev.filter((n) => n.sender._id !== targetUserId)
      );

      await getNotifications();
    } catch (error) {
      console.log("Error updating matching: ", error);
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

  const handleNextToChat = (matchedUserId: string) => {
    router.push(`/matching?chatWith=${matchedUserId}`);
  };

  const handleShowModal = (notification: any) => {
    setSelectedUser(notification.sender);

    // เอาการแจ้งเตือนออกจาก list
    setNotifications((prev) => prev.filter((n) => n !== notification));
  };

  const handleCloseModal = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }

    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    setSelectedUser(null);
    setActiveIndex(0);
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

  useEffect(() => {
    if (status === "authenticated") {
      getNotifications(); // เรียก API เฉพาะเมื่อผู้ใช้ล็อกอินแล้ว
    }

    if (selectedUser) {
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
    }
  }, [selectedUser]);

  return (
    <div className="sticky top-0 z-50 px-[200px] border-[1px] w-full h-[88px] bg-white flex flex-row justify-between items-center shadow-md">
      <Link href="/">
        <img src="/images/logo.png" alt="logo" className="w-[220px]" />
      </Link>

      {!clientSession ? (
        <div className="flex items-center gap-[32px]">
          <Link
            href="/#Why-Merry-Match"
            className="text-purple-800 text-[16px] font-[700]"
          >
            <span>Why Merry Match?</span>
          </Link>

          <Link
            href="/#How-to-Merry"
            className="text-purple-800 text-[16px] font-[700]"
          >
            <span>How to Merry</span>
          </Link>

          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className="p-[12px_24px_12px_24px] text-white text-[16px] font-[700] rounded-[99px] bg-red-500 active:scale-95"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-[32px]">
          <button
            onClick={() => {
              router.push("/matching");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Start Matching!
          </button>

          <button
            onClick={() => {
              router.push("/package");
            }}
            className="text-purple-800 text-[16px] font-[700]"
          >
            Merry Membership
          </button>

          <div className="flex items-center gap-[12px]">
            <div className="dropdown">
              <button className="p-[10px] bg-gray-100 rounded-[100%]">
                <FaBell className="text-[20px] text-red-200" />
              </button>
              <div
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[275px] p-2 shadow"
              >
                {notifications.length > 0 ? (
                  <div className="carousel carousel-vertical rounded-box h-[222px]">
                    {notifications.map((notification, index_notification) => (
                      <button
                        key={index_notification}
                        className={`carousel-item px-[14px] py-[12px] w-[230px] border-b-[1px] flex items-start gap-[10px] hover:bg-gray-100 ${
                          notification.type === "rejected"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (notification.type === "matchRequest") {
                            handleShowModal(notification);
                          } else if (notification.type === "matchResponse") {
                            handleNextToChat(notification.sender._id);
                          }
                        }}
                        disabled={notification.type === "rejected"}
                      >
                        <span className="w-[40px] h-[40px] relative">
                          <img
                            src={notification.sender?.image?.[0]?.url}
                            className="absolute w-[40px] h-[40px] rounded-[100%]"
                          />
                          {notification.type === "matchRequest" ? (
                            <img
                              src="/images/icon-oneheart.png"
                              className="absolute right-0 bottom-0 w-[10px] h-[10px]"
                              alt="Pending"
                            />
                          ) : notification.type === "matchResponse" ? (
                            <img
                              src="/images/icon-doubleheart.png"
                              className="absolute right-0 bottom-0 w-[20px] h-[10px]"
                              alt="Matched"
                            />
                          ) : notification.type === "matchSuccess" ? (
                            <img
                              src={userImage}
                              className="absolute right-0 bottom-0 w-[20px] h-[20px] rounded-[100%]"
                              alt="Matched"
                            />
                          ) : null}
                        </span>

                        <span className="text-left flex flex-col justify-start">
                          {notification.type === "matchRequest" ? (
                            <>
                              <div>{notification.message}</div>
                              <div>Click here to see profile</div>
                            </>
                          ) : notification.type === "matchResponse" ? (
                            <>
                              <div>{notification.message}</div>
                              <div>Let&apos;s start conversation now</div>
                            </>
                          ) : notification.type === "matchSuccess" ? (
                            <>
                              <div>{notification.message}</div>
                              <div>Let&apos;s start conversation now</div>
                            </>
                          ) : notification.type === "rejected" ? (
                            <>
                              <div>{notification.message}</div>
                              <div>Can&apos;t see Profile</div>
                            </>
                          ) : null}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>empty!</div>
                )}
              </div>
            </div>

            {selectedUser && (
              <dialog id="my_modal_3" className="modal">
                <div
                  className="modal-box"
                  style={{ width: "1000px", maxWidth: "100%", height: "550px" }}
                >
                  <form method="dialog">
                    <button
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                      onClick={handleCloseModal}
                    >
                      ✕
                    </button>
                  </form>
                  <div className="p-[20px_0px_20px_20px] w-full h-full flex justify-between gap-[15px]">
                    <div className="w-[50%] h-[80%] flex flex-col gap-[25px]">
                      <div className="relative w-full h-full">
                        <Swiper
                          slidesPerView={1}
                          ref={swiperRef}
                          onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                          }
                          className="absolute w-full h-[100%] flex overflow-hidden"
                        >
                          {selectedUser.image.map((image, index_image) => (
                            <SwiperSlide key={index_image}>
                              <img
                                src={image.url}
                                className="w-full h-full object-cover rounded-[32px]"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        <div className="absolute z-10 bottom-[-30px] border-gray-700 w-full text-[32px] flex justify-center items-center">
                          <div className="flex gap-[24px]">
                            <button
                              onClick={() => {
                                updateMatching(selectedUser._id, "rejected");
                                handleCloseModal();
                              }}
                              className="w-[60px] h-[60px] text-[42px] text-gray-700 bg-white rounded-[16px] flex justify-center items-center shadow-md active:text-[40px]"
                            >
                              <IoClose />
                            </button>
                            <button
                              onClick={() => {
                                updateMatching(selectedUser._id, "matched");
                                handleCloseModal();
                              }}
                              className="w-[60px] h-[60px] text-[36px] text-red-500 bg-white rounded-[16px] flex justify-center items-center shadow-md active:text-[34px]"
                            >
                              <IoHeart />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="px-[24px] py-[12px]">
                          {activeIndex + 1}/{selectedUser.image.length}
                        </div>
                        <div className="flex">
                          <button
                            onClick={handlePrevSlide}
                            className="w-[38px] text-[20px] active:text-[19px]"
                          >
                            <FaArrowLeft />
                          </button>
                          <button
                            onClick={handleNextSlide}
                            className="w-[38px] text-[20px] active:text-[19px]"
                          >
                            <FaArrowRight />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-[16px] pl-[60px] w-full flex flex-col gap-[60px]">
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex gap-[16px]">
                          <div className="text-gray-900 text-[46px] font-[800]">
                            {selectedUser.name}
                          </div>
                          <div className="text-gray-700 text-[46px] font-[800]">
                            {calculateAge(selectedUser.dateOfBirth)}
                          </div>
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <HiLocationMarker className="text-red-200 text-[20px]" />
                          <div className="text-gray-700 text-[20px] font-[600]">
                            {selectedUser.state},{selectedUser.country}
                          </div>
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="w-full flex items-center">
                          <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                            Sexual identities
                          </div>
                          <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                            {selectedUser.sexIdent}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                            Sexual preferences
                          </div>
                          <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                            {selectedUser.sexPref}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                            Racial preferences
                          </div>
                          <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                            {selectedUser.racialPref}
                          </div>
                        </div>
                        <div className="w-full flex items-center">
                          <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                            Meeting interests
                          </div>
                          <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                            {selectedUser.meeting}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-900 text-[24px] font-[700]">
                          hobies and interest
                        </div>
                        <div className="text-gray-900 text-[16px] font-[400]">
                          {selectedUser.hobbies}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </dialog>
            )}

            <div className="dropdown dropdown-end">
              {userImage ? (
                <Avatar
                  alt={userName || undefined}
                  src={userImage}
                  className="cursor-pointer"
                  tabIndex={0}
                />
              ) : null}

              {/* Drop down */}
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a href="/profile">
                    <BsPeopleFill className="text-red-100" /> Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      alert("This feature is not available at the moment.");
                    }}
                  >
                    <AiFillHeart className="text-red-100" /> Merry List
                  </a>
                </li>
                <li>
                  <a href="/package">
                    <IoIosCube className="text-red-100" /> Merry Memberhip
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      alert("This feature is not available at the moment.");
                    }}
                  >
                    <FaTriangleExclamation className="text-red-100" /> Compliant
                  </a>
                </li>
                <hr className="w-full border-[1px]" />
                <li>
                  <button onClick={() => signOut()}>
                    <IoIosLogOut className="text-[15px]" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
