"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useFormContext, FormRegister } from "@/app/context/register/Register";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

interface PropsInput {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
  className?: string;
}

interface ValidationErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  country?: string;
  sexPref?: string;
  sexIdent?: string;
  racialPref?: string;
  meeting?: string;
  hobbies?: string;
  image?: string;
}

const InputField: React.FC<PropsInput> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  error,
}) => (
  <div className="relative flex flex-col gap-[4px]">
    <div>{label}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] ${
        error ? "border-red-500" : "border-gray-400"
      } rounded-[8px] placeholder:text-gray-600 outline-none`}
    />
    {error && (
      <div className={`absolute text-red-500 text-sm bottom-[-20px]`}>
        {error}
      </div>
    )}
  </div>
);

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [avatarImage, setAvatarImage] = useState<{
    [key: string]: File | string;
  }>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    country: "",
    sexPref: "",
    sexIdent: "",
    racialPref: "",
    meeting: "",
    hobbies: "",
    image: "",
  });

  const router = useRouter();

  const { allData, updateFormData, currentStep, setCurrentStep } =
    useFormContext();

  // console.log("check formData", allData);

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.isoCode === code);
    return country ? country.name : "";
  };

  const getStateName = (code: string) => {
    const state = states.find((s) => s.isoCode === code);
    return state ? state.name : "";
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key_images: string
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatarImage((prevImages) => {
        const updatedImages = { ...prevImages, [key_images]: file };
        console.log("check avatarimage", updatedImages);
        return updatedImages;
      });
    }
  };

  const handleDeleteImage = (key_images: string) => {
    setAvatarImage((prevImages) => {
      const updatedImages = { ...prevImages };
      updatedImages[key_images] = "";
      // console.log("check avatarimage", updatedImages);
      return updatedImages;
    });
  };

  const validateFormRequired = (): boolean => {
    if (currentStep === 1) {
      return (
        !!allData.name &&
        !!allData.username &&
        !!allData.email &&
        !!allData.password &&
        !!allData.confirmPassword &&
        !!allData.dateOfBirth &&
        !!allData.country
      );
    } else if (currentStep === 2) {
      return !!allData.hobbies;
    } else if (currentStep === 3) {
      const uploadedImagesCount = Object.values(avatarImage).filter(
        (img) => img && typeof img !== "string"
      ).length;
      return uploadedImagesCount >= 2; // ต้องมีการอัปโหลดอย่างน้อย 2 รูป
    }
    return false;
  };

  const handleNext = () => {
    let validationErrors: ValidationErrors = {};

    if (currentStep === 1) {
      validationErrors = validateForm();
    } else if (currentStep === 2) {
      validationErrors = validateForm2();
    }

    // ตรวจสอบทุกฟิลด์
    const allFieldsFilled = validateFormRequired();
    if (!allFieldsFilled) {
      toast.error("All fields are required.");
      return;
    }

    // ถ้ามีข้อผิดพลาด
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, ...validationErrors }));
      toast.error("Please correct the errors before submitting.");
      return;
    }

    // ถ้าไม่มีข้อผิดพลาด ให้เคลียร์ errors และไปหน้าถัดไป
    setErrors({} as ValidationErrors);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = (): ValidationErrors => {
    let newErrors: ValidationErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const usernameRegex = /^[A-Za-z0-9]+$/;
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|email\.com)$/;

    if (
      (allData.name && !nameRegex.test(allData.name)) ||
      allData.name.length > 20
    ) {
      newErrors.name = `Name must only contain letters and spaces (maximum 20 charactors: ${allData.name.length})`;
    }

    if (allData.email && !emailRegex.test(allData.email)) {
      newErrors.email = "user@gmail.com";
    }

    if (allData.dateOfBirth && !allData.dateOfBirth) {
      newErrors.dateOfBirth = "Please enter your birth date.";
    }

    if (allData.username && !usernameRegex.test(allData.username)) {
      newErrors.username = "Username must only contain letters and spaces";
    } else if (
      (allData.username && allData.username.length < 6) ||
      allData.username.length > 12
    ) {
      newErrors.username = `At least 6 - 12 characters (${allData.username.length})`;
    }

    if (allData.password && !allData.password) {
      newErrors.password = "Password is required";
    }

    if (
      allData.confirmPassword &&
      allData.password !== allData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (allData.country && !allData.country) {
      newErrors.country = "Please select a country";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const validateForm2 = (): ValidationErrors => {
    let newErrors: ValidationErrors = {};

    const hobbyRegex = /^[a-zA-Z,\s]+$/;

    if (
      (allData.hobbies && !hobbyRegex.test(allData.hobbies)) ||
      allData.hobbies.length > 30
    ) {
      newErrors.hobbies = `Example: Football, Playgame, musicle (${allData.hobbies.length})`;
    }

    setErrors(newErrors);

    return newErrors;
  };

  const validateForm3 = (): ValidationErrors => {
    let newErrors: ValidationErrors = {};

    const uploadedImagesCount = Object.values(avatarImage).filter(
      (img) => img && typeof img !== "string"
    ).length;
    if (uploadedImagesCount < 2) {
      newErrors.image = "At least 2 image";
    }

    setErrors(newErrors);

    return newErrors;
  };

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value });

    // ตรวจสอบฟอร์มแบบเรียลไทม์ตาม currentStep
    let validationErrors: ValidationErrors = {};
    if (currentStep === 1) {
      validationErrors = validateForm();
    } else if (currentStep === 2) {
      validationErrors = validateForm2();
    }

    setErrors(validationErrors); // อัปเดต errors แบบเรียลไทม์
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // handleSubmit ควรถูกเรียกเฉพาะใน Step 3
    if (currentStep !== 3) {
      return;
    }

    // ตรวจสอบฟอร์มในขั้นตอนที่ 3
    let validationErrors: ValidationErrors = {};
    validationErrors = validateForm3();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please upload at least 2 photos");
      return;
    }

    const results = new FormData();
    results.append("name", allData.name);
    results.append("username", allData.username);
    results.append("email", allData.email);
    results.append("password", allData.password);
    results.append("confirmPassword", allData.confirmPassword);
    results.append("dateOfBirth", allData.dateOfBirth);
    results.append("country", getCountryName(allData.country));
    results.append("state", getStateName(allData.state));
    results.append("sexIdent", allData.sexIdent);
    results.append("sexPref", allData.sexPref);
    results.append("racialPref", allData.racialPref);
    results.append("meeting", allData.meeting);
    results.append("hobbies", allData.hobbies);
    Object.keys(avatarImage).forEach((key_image) => {
      if (
        avatarImage[key_image] &&
        typeof avatarImage[key_image] !== "string"
      ) {
        results.append("image", avatarImage[key_image]);
      }
      // console.log(avatarImage[key_image]);
    });

    // console.log("result check client", allData);

    try {
      const response = await axios.post(`/api/auth/register`, results, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLoading(true);
      toast.success("Registration successful!");
      router.push("/auth/login");

      console.log("User registered:", response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message); // แสดงข้อความ error จาก server
      } else {
        toast.error(`Registration failed. Please try again.`);
      }
      setLoading(false);
      console.log("Can't register now error", error);
    }
    // console.log("Form submitted:", results);
    // router.push("/auth/login");
  };

  useEffect(() => {
    let validationErrors: ValidationErrors = {};

    if (currentStep === 1) {
      validationErrors = validateForm();
    } else if (currentStep === 2) {
      validationErrors = validateForm2();
    } else if (currentStep === 3) {
      validationErrors = validateForm3();
    }

    setErrors(validationErrors);
  }, [allData, currentStep]);

  useEffect(() => {
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (allData.country) {
      const stateList = State.getStatesOfCountry(allData.country);
      setStates(stateList);
    } else {
      setStates([]);
    }
  }, [allData.country]);

  return (
    <div className="w-screen">
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col justify-between"
      >
        <div className="h-screen flex flex-col items-center">
          <div
            className={`w-[1200px] h-[700px] flex flex-col items-center gap-[35px] ${
              currentStep === 1
                ? "mt-[120px]"
                : currentStep === 2
                ? "mt-[120px]"
                : currentStep === 3
                ? "mt-[120px]"
                : ""
            }`}
          >
            <div className="w-full flex justify-between">
              <div className="flex flex-col">
                <div>REGISTER</div>
                <div className="w-[80%] text-[46px] text-purple-500 font-bold">
                  Join us and start matching
                </div>
              </div>
              <div className="h-[80px] flex gap-[12px]">
                {currentStep === 1 ? (
                  <>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center gap-[16px]">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-gray-700 text-[12px] font-[500]">
                          Step 1/3
                        </div>
                        <div className="text-purple-500 font-[800]">
                          Basic Information
                        </div>
                      </div>
                    </div>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                    </div>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                    </div>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center gap-[16px]">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-gray-700 text-[12px] font-[500]">
                          Step 2/3
                        </div>
                        <div className="text-purple-500 font-[800]">
                          Identities and Interests
                        </div>
                      </div>
                    </div>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        1
                      </div>
                    </div>
                    <div className="border-[1px] border-gray-300 p-[16px] rounded-[16px] flex justify-center items-center">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-gray-600 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        2
                      </div>
                    </div>
                    <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center gap-[16px]">
                      <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-[700] rounded-[16px] flex justify-center items-center">
                        3
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-gray-700 text-[12px] font-[500]">
                          Step 3/3
                        </div>
                        <div className="text-purple-500 font-[800]">
                          Upload Photos
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {currentStep === 1 && (
              <div className="w-full h-full flex flex-col gap-[24px]">
                <div className="text-[24px] text-purple-500">
                  Basic Information
                </div>
                <div className="w-full grid grid-cols-2 gap-x-[40px] gap-y-[35px]">
                  <InputField
                    label="Name"
                    placeholder="John Snow"
                    type="text"
                    value={allData.name}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value);
                    }}
                    error={errors.name}
                  />

                  <InputField
                    label="Date of birth"
                    placeholder="01/01/2022"
                    type="date"
                    value={allData.dateOfBirth}
                    onChange={(e) => {
                      handleInputChange("dateOfBirth", e.target.value);
                    }}
                    error={errors.dateOfBirth}
                  />

                  <div className="flex flex-col gap-[4px]">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      value={allData.country}
                      onChange={(e) =>
                        updateFormData({ country: e.target.value })
                      }
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Select Country</option>
                      {countries.map((countries, index_country) => (
                        <option
                          key={countries.isoCode + index_country}
                          value={countries.isoCode}
                        >
                          {countries.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <div className="text-red-500 text-sm">
                        {errors.country}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <label htmlFor="state">State</label>
                    <select
                      id="state"
                      value={allData.state}
                      onChange={(e) =>
                        updateFormData({ state: e.target.value })
                      }
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Select State</option>
                      {states.map((state, index_state) => (
                        <option
                          key={state.isoCode + index_state}
                          value={state.isoCode}
                        >
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Username"
                    placeholder="At least 6 characters"
                    type="text"
                    value={allData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    error={errors.username}
                  />

                  <InputField
                    label="Email"
                    placeholder="name@website.com"
                    type="email"
                    value={allData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    error={errors.email}
                  />

                  <InputField
                    label="Password"
                    placeholder="At least 8 characters"
                    type="text"
                    value={allData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    error={errors.password}
                  />

                  <InputField
                    label="Confirm password"
                    placeholder="At least 8 characters"
                    type="text"
                    value={allData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="w-full h-full flex flex-col gap-[24px]">
                <div className="text-[24px] text-purple-500">
                  Identities and Interests
                </div>

                <div className="w-full grid grid-cols-2 gap-x-[40px] gap-y-[40px]">
                  <div className="flex flex-col gap-[4px]">
                    <div>Sexual Identities</div>
                    <select
                      id="sexualIden"
                      value={allData.sexIdent}
                      onChange={(e) =>
                        updateFormData({ sexIdent: e.target.value })
                      }
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Sexual</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Sexual preferences</div>
                    <select
                      id="sexualPref"
                      value={allData.sexPref}
                      onChange={(e) => {
                        updateFormData({ sexPref: e.target.value });
                      }}
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Sexual</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Racial preferences</div>
                    <select
                      id="racialPref"
                      value={allData.racialPref}
                      onChange={(e) => {
                        updateFormData({ racialPref: e.target.value });
                      }}
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Types</option>
                      <option>Any Race/Ethnicity</option>
                      <option>Caucasian/White</option>
                      <option>Hispanic/Latino</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[4px]">
                    <div>Meeting interests</div>
                    <select
                      id="Meeting"
                      value={allData.meeting}
                      onChange={(e) => {
                        updateFormData({ meeting: e.target.value });
                      }}
                      className="p-[12px_16px_12px_12px] w-[100%] h-[50px] border-[1px] border-gray-400 rounded-[8px] outline-none"
                    >
                      <option value="">Meeting Types</option>
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
                    <InputField
                      label="Hobbies / Interests (Maximum 30 characters)"
                      placeholder="Football, Playgame, musicle"
                      type="text"
                      value={allData.hobbies}
                      onChange={(e) =>
                        handleInputChange("hobbies", e.target.value)
                      }
                      error={errors.hobbies}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="w-full flex flex-col gap-[24px]">
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
                      className="relative w-[200px] h-[200px] rounded-[16px] bg-gray-200 flex justify-center items-center"
                    >
                      {avatarImage[key_images] instanceof File ? (
                        <div className="">
                          <img
                            src={URL.createObjectURL(avatarImage[key_images])}
                            alt={"uploaded photo" + index_image}
                            className="w-[200px] h-[200px] rounded-[16px]"
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
                              // event.preventDefault();
                              handleFileChange(event, key_images);
                            }}
                            className="text-[13px] absolute left-[-30px] opacity-0"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="h-[100px] px-[200px] border-[1px] align-bottom flex justify-between items-center">
            <span className="text-gray-800">
              1<span className="text-gray-600">/3</span>
            </span>
            <div className="flex gap-[24px]">
              <button
                disabled
                className="text-gray-500 font-[700] flex items-center gap-[10px]"
              >
                <FaArrowLeft className="text-[15px]" /> Back
              </button>
              <button
                onClick={handleNext}
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="h-[100px] px-[200px] border-[1px] flex justify-between items-center">
            <span className="text-gray-800">
              2<span className="text-gray-600">/3</span>
            </span>
            <div className="flex items-center gap-[24px]">
              <button
                onClick={handleBack}
                className="text-red-500 font-[700] flex items-center gap-[10px]"
              >
                <FaArrowLeft className="text-[15px]" /> Back
              </button>
              <button
                onClick={handleNext}
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="h-[100px] px-[200px] border-[1px] flex justify-between items-center">
            <span className="text-gray-800">
              3<span className="text-gray-600">/3</span>
            </span>
            <div className="flex gap-[24px]">
              <button
                onClick={handleBack}
                className="text-red-500 font-[700] flex items-center gap-[10px]"
              >
                <FaArrowLeft className="text-[15px]" /> Back
              </button>
              <button
                type="submit"
                className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

const RegisterPage: React.FC = () => (
  <FormRegister>
    <Register />
  </FormRegister>
);

export default RegisterPage;
