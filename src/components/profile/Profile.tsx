"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  dateOfBirth: string;
  country: string;
  state: string;
  username: string;
  email: string;
  sexIdent: string;
  sexPref: string;
  racialPref: string;
  hobbies: string;
  meeting: string;
  image: { url: string; publicId: string }[];
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeImageModalIndex, setActiveImageModalIndex] = useState<number>(0);
  const [avatarImage, setAvatarImage] = useState<{
    [key: string]: File | string;
  }>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  const swiperModalRef = useRef<any>(null);

  const getUser = async () => {
    try {
      const response = await axios.get("/api/users/me");

      // console.log("Check user data: ", response.data);
      setUser(response.data);

      const updatedImages = { ...avatarImage };
      response.data.image.forEach((img: { url: string }, index: number) => {
        updatedImages[index + 1] = img.url;
      });
      setAvatarImage(updatedImages);
    } catch (error) {
      console.log("Error fetching your data:", error);
    }
  };

  const updatedProfile = async () => {
    if (!user) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", user.name);
      formData.append("sexPref", user.sexPref);
      formData.append("racialPref", user.racialPref);
      formData.append("hobbies", user.hobbies);
      formData.append("meeting", user.meeting);

      user.image.forEach((img) => {
        formData.append("existingImages", img.url);
      });

      // เพิ่มไฟล์ภาพ
      Object.values(avatarImage).forEach((image) => {
        if (image instanceof File) {
          formData.append("image", image);
        }
      });

      const response = await axios.put(`/api/users/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("Profile updated: ", response.data);
      setUser(response.data);

      getUser();
    } catch (error) {
      console.log("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key_images: string
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatarImage((prevImages) => ({ ...prevImages, [key_images]: file }));

      setUser((prev) => {
        if (!prev) return prev;

        const updatedImages = [...prev.image];
        updatedImages[parseInt(key_images) - 1] = {
          url: URL.createObjectURL(file),
          publicId: "",
        };

        return { ...prev, image: updatedImages };
      });
    }
  };

  const handleDeleteImage = (key_images: string) => {
    setAvatarImage((prevImages) => ({ ...prevImages, [key_images]: "" }));

    setUser((prev) => {
      if (!prev) return prev;

      const updatedImages = prev.image.filter(
        (_, index) => index !== parseInt(key_images) - 1
      );

      return { ...prev, image: updatedImages };
    });
  };

  const handleOpenModal = () => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    setActiveImageModalIndex(0);
  };

  const handleNextSlideImageModal = () => {
    if (swiperModalRef.current && swiperModalRef.current.swiper) {
      swiperModalRef.current.swiper.slideNext();
    }
  };

  const handlePrevSlideImageModal = () => {
    if (swiperModalRef.current && swiperModalRef.current.swiper) {
      swiperModalRef.current.swiper.slidePrev();
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

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <form
        onSubmit={updatedProfile}
        className="py-[50px] bg-BGMain flex justify-center"
      >
        {user && (
          <div className="w-[930px] flex flex-col gap-[80px]">
            <section className="flex justify-between">
              <div className="flex flex-col gap-[8px]">
                <div className="text-beige-700">PROFILE</div>
                <div className="text-[46px] text-purple-500 font-bold leading-[1.2] flex flex-col">
                  <span>Let’s make profile</span>
                  <span>to let others know you</span>
                </div>
              </div>
              <div className="flex justify-end items-end gap-[16px]">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="px-[24px] py-[12px] text-[16px] font-[700] text-red-600 bg-red-100 rounded-[99px] active:scale-95"
                >
                  Preview Profile
                </button>
                <button
                  type="submit"
                  className="px-[24px] py-[12px] text-[16px] font-[700] text-white bg-red-500 rounded-[99px] active:scale-95"
                >
                  Update Profile
                </button>
              </div>
            </section>

            <section className="flex flex-col gap-[24px]">
              <div className="text-[24px] font-[700] text-gray-900">
                Basic Information
              </div>
              <div className="grid grid-cols-2 gap-x-[40px] gap-y-[35px] max-[1440px]:gap-y-[20px]">
                <div className="flex flex-col gap-[4px]">
                  <div>Name</div>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="p-[12px_16px_12px_12px] w-full h-[45px] border-[1px] rounded-[8px] placeholder:text-gray-600 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-[4px]">
                  <div className="text-gray-600">Date of birth</div>
                  <input
                    type="date"
                    defaultValue={user.dateOfBirth.split("T")[0]}
                    className="p-[12px_16px_12px_12px] w-full h-[45px] border-[1px] bg-gray-200 rounded-[8px] outline-none"
                    style={{ pointerEvents: "none" }}
                  />
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label className="text-gray-600">Location</label>
                  <select
                    id="country"
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 bg-gray-200 rounded-[8px] outline-none"
                    style={{ pointerEvents: "none" }}
                  >
                    <option value="">{user.country}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <div className="text-gray-600">City</div>
                  <select
                    id="city"
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 bg-gray-200 rounded-[8px] outline-none"
                    style={{ pointerEvents: "none" }}
                  >
                    <option value="">{user.state}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <div className="text-gray-600">Username</div>
                  <input
                    type="text"
                    placeholder={user.username}
                    className="p-[12px_16px_12px_12px] w-full h-[45px] border-[1px] bg-gray-200 rounded-[8px] placeholder:text-black outline-none"
                    style={{ pointerEvents: "none" }}
                  />
                </div>

                <div className="flex flex-col gap-[4px]">
                  <div className="text-gray-600">Email</div>
                  <input
                    type="text"
                    placeholder={user.email}
                    className="p-[12px_16px_12px_12px] w-full h-[45px] border-[1px] bg-gray-200 rounded-[8px] placeholder:text-black outline-none"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-[24px]">
              <div className="text-[24px] font-[700] text-gray-900">
                Identities and Interests
              </div>
              <div className="grid grid-cols-2 gap-x-[40px] gap-y-[35px] max-[1440px]:gap-y-[20px]">
                <div className="flex flex-col gap-[4px]">
                  <label className="text-gray-600">Sexual identities </label>
                  <select
                    id="sexualIden"
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 bg-gray-200 rounded-[8px] outline-none"
                    style={{ pointerEvents: "none" }}
                  >
                    <option value="">{user.sexIdent}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label>Sexual preferences</label>
                  <select
                    id="sexualPref"
                    value={user.sexPref}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, sexPref: e.target.value } : prev
                      )
                    }
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                  >
                    <option value="">{user.sexPref}</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label>Racial preferences</label>
                  <select
                    id="racialPref"
                    value={user.racialPref}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, racialPref: e.target.value } : prev
                      )
                    }
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                  >
                    <option value="">{user.racialPref}</option>
                    <option>Any Race/Ethnicity</option>
                    <option>Caucasian/White</option>
                    <option>Hispanic/Latino</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label>Meeting interests</label>
                  <select
                    id="meeting"
                    value={user.meeting}
                    onChange={(e) =>
                      setUser((prev) =>
                        prev ? { ...prev, meeting: e.target.value } : prev
                      )
                    }
                    className="p-[12px_16px_12px_12px] w-[100%] h-[45px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                  >
                    <option value="">{user.meeting}</option>
                    <option>Outdoor Activities</option>
                    <option>Social Events</option>
                    <option>Cultural Activities</option>
                    <option>Sports and Fitness</option>
                    <option>Dining Out</option>
                    <option>Travel and Adventure</option>
                    <option>Home-Based Activities</option>
                    <option>Learning and Development</option>
                    <option>Volunteer Work</option>
                    <option>Relaxation and Wellness</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col gap-[4px]">
                    <div>Hobbies / Interests</div>
                    <input
                      type="text"
                      value={user.hobbies}
                      onChange={(e) =>
                        setUser((prev) =>
                          prev ? { ...prev, hobbies: e.target.value } : prev
                        )
                      }
                      className="p-[12px_16px_12px_12px] w-full h-[45px] border-[1px] rounded-[8px] placeholder:text-gray-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-[24px]">
              <div className="text-[24px] text-purple-500 font-[700]">
                Profile pictures
              </div>
              <div className="text-[16px] text-gray-800 font-400">
                Upload at least 2 photos
              </div>
              <div className="flex justify-between gap-[20px]">
                {Object.keys(avatarImage).map((key_images, index_image) => (
                  <div
                    key={index_image}
                    className="relative w-[167px] h-[167px] rounded-[16px] bg-gray-200 flex justify-center items-center"
                  >
                    {avatarImage[key_images] ? (
                      <div className="">
                        <img
                          src={
                            typeof avatarImage[key_images] === "string"
                              ? (avatarImage[key_images] as string)
                              : URL.createObjectURL(
                                  avatarImage[key_images] as File
                                )
                          }
                          alt={"uploaded photo" + index_image}
                          className="w-[167px] h-[167px] rounded-[16px]"
                        />
                        <button
                          type="button"
                          id={"remove-image" + index_image}
                          onClick={() => {
                            handleDeleteImage(key_images);
                          }}
                          className="absolute top-[-8px] right-[-8px] rounded-[100%] w-[24px] h-[24px] text-white font-[600] bg-redMain flex justify-center items-center"
                        >
                          x
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center relative">
                        <div className="text-purple-600 text-[30px]">+</div>
                        <div className="text-purple-600 text-[14px] font-[500]">
                          Upload photo
                        </div>
                        <input
                          type="file"
                          onChange={(event) => {
                            handleFileChange(event, key_images);
                          }}
                          className="text-[13px] absolute left-[-30px] opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </form>

      {user && (
        <dialog id="my_modal_3" className="modal">
          <div
            className="modal-box"
            style={{
              width: "1000px",
              maxWidth: "100%",
              height: "550px",
            }}
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
                    ref={swiperModalRef}
                    onSlideChange={(swiper) =>
                      setActiveImageModalIndex(swiper.realIndex)
                    }
                    className="absolute w-full h-[100%] flex overflow-hidden"
                  >
                    {user.image.map((image, index_image) => (
                      <SwiperSlide key={index_image}>
                        <img
                          src={image.url}
                          className="w-full h-full object-cover rounded-[32px]"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="flex justify-between">
                  <div className="px-[24px] py-[12px]">
                    {activeImageModalIndex + 1}/{user.image.length}
                  </div>
                  <div className="flex">
                    <button
                      onClick={handlePrevSlideImageModal}
                      className="w-[38px] text-[20px] active:text-[19px]"
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      onClick={handleNextSlideImageModal}
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
                      {user.name}
                    </div>
                    <div className="text-gray-700 text-[46px] font-[800]">
                      {calculateAge(user.dateOfBirth)}
                    </div>
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <HiLocationMarker className="text-red-200 text-[20px]" />
                    <div className="text-gray-700 text-[20px] font-[600]">
                      {user.state},{user.country}
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="w-full flex items-center">
                    <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                      Sexual identities
                    </div>
                    <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                      {user.sexIdent}
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                      Sexual preferences
                    </div>
                    <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                      {user.sexPref}
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                      Racial preferences
                    </div>
                    <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                      {user.racialPref}
                    </div>
                  </div>
                  <div className="w-full flex items-center">
                    <div className="w-[45%] text-gray-900 text-[16px] font-[400]">
                      Meeting interests
                    </div>
                    <div className="w-[55%] text-gray-700 text-[20px] font-[600]">
                      {user.meeting}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-900 text-[24px] font-[700]">
                    hobies and interest
                  </div>
                  <div className="text-gray-900 text-[16px] font-[400]">
                    {user.hobbies}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Profile;
