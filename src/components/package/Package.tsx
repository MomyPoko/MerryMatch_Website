"use client";

import { IoHeart } from "react-icons/io5";
import { TiStarFullOutline } from "react-icons/ti";
import { HiMiniSparkles } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";

const Package = () => {
  return (
    <div className="pt-[50px] w-full bg-BGMain flex flex-col items-center">
      <div className="w-[1120px] flex flex-col gap-[60px]">
        <div className="flex flex-col gap-[8px]">
          <div className="text-beige-700">MERRY MEMBERSHIP</div>
          <div className="text-[46px] text-purple-500 font-bold leading-[1.2] flex flex-col">
            <span>Be part of Merry Membership</span>
            <span>to make more Merry!</span>
          </div>
        </div>
        <div className="flex gap-[24px]">
          <div className="p-[40px] w-[355px] bg-white border-[1px] rounded-[32px] flex flex-col gap-[24px]">
            <div className="w-[60px] h-[60px] bg-gray-100 rounded-[16px] flex justify-center items-center">
              <IoHeart className="text-[30px] text-purple-400" />
            </div>
            <div className="flex flex-col items-start gap-[8px]">
              <div className="text-[32px] font-[700] text-purple-800">
                Basic
              </div>
              <div>
                <span className="text-[32px] text-gray-900">THB 59.00</span>
                <span className="text-[16px] font-[400] text-gray-600">
                  /Month
                </span>
              </div>
            </div>
            <div className="pb-[24px] border-b-[1px] flex flex-col items-start gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  Up to 25 Merry per day
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                alert("This feature is not available at the moment.")
              }
              className="px-[24px] py-[12px] text-[16px] font-[700] text-red-600 bg-red-100 rounded-[99px] hover:bg-red-200"
            >
              Choose Package
            </button>
          </div>

          <div className="p-[40px] w-[355px] bg-white border-[1px] rounded-[32px] flex flex-col gap-[24px]">
            <div className="w-[60px] h-[60px] bg-gray-100 rounded-[16px] flex justify-center items-center">
              <TiStarFullOutline className="text-[30px] text-beige-400" />
            </div>
            <div className="flex flex-col items-start gap-[8px]">
              <div className="text-[32px] font-[700] text-purple-800">
                Basic
              </div>
              <div>
                <span className="text-[32px] text-gray-900">THB 99.00</span>
                <span className="text-[16px] font-[400] text-gray-600">
                  /Month
                </span>
              </div>
            </div>
            <div className="pb-[24px] border-b-[1px] flex flex-col items-start gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  Up to 45 Merry per day
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                alert("This feature is not available at the moment.")
              }
              className="px-[24px] py-[12px] text-[16px] font-[700] text-red-600 bg-red-100 rounded-[99px] hover:bg-red-200"
            >
              Choose Package
            </button>
          </div>

          <div className="p-[40px] w-[355px] bg-white border-[1px] rounded-[32px] flex flex-col gap-[24px]">
            <div className="w-[60px] h-[60px] bg-gray-100 rounded-[16px] flex justify-center items-center">
              <HiMiniSparkles className="text-[30px] text-[#F3B984]" />
            </div>
            <div className="flex flex-col items-start gap-[8px]">
              <div className="text-[32px] font-[700] text-purple-800">
                Basic
              </div>
              <div>
                <span className="text-[32px] text-gray-900">THB 149.00</span>
                <span className="text-[16px] font-[400] text-gray-600">
                  /Month
                </span>
              </div>
            </div>
            <div className="pb-[24px] border-b-[1px] flex flex-col items-start gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  ‘Merry’ more than a daily limited
                </span>
              </div>
              <div className="flex items-center gap-[12px]">
                <FaCheck className="text-white bg-red-400 rounded-[99px]" />

                <span className="text-[16px] font-[400] text-gray-800">
                  Up to 70 Merry per day
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                alert("This feature is not available at the moment.")
              }
              className="px-[24px] py-[12px] text-[16px] font-[700] text-red-600 bg-red-100 rounded-[99px] hover:bg-red-200"
            >
              Choose Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Package;
