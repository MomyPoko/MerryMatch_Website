const Footer = () => {
  return (
    <div className="w-full h-[370px] flex justify-center items-center">
      <div className="h-[275px] flex flex-col justify-between">
        <div className="flex flex-col items-center">
          <img src="/images/logo.png" alt="logo-footer" className="w-[220px]" />
          <div className="text-[20px] text-gray-700 font-[600]">
            New generation of online dating website for everyone
          </div>
        </div>
        <div className="pt-[24px] border-gray-300 border-t-[1px] w-[1200px] flex flex-col items-center gap-[24px]">
          <div className="text-gray-600">
            copyright ©2022 merrymatch.com All rights reserved
          </div>
          <div className="flex gap-[16px]">
            <button>
              <img src="/images/icon-facebook.png" alt="icon-facebook" />
            </button>
            <button>
              <img src="/images/icon-ig.png" alt="icon-ig" />
            </button>
            <button>
              <img src="/images/icon-twitter.png" alt="icon-twitter" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
