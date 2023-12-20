import { useMemo } from "react";
import Link from "next/link";
import Login from "page-parts/com/login/login-form";

const Index: React.FC = () => {
  return (
    <>
      <div className="w-full xl:grid xl:grid-cols-3">
        <div className="hidden w-full col-span-2 xl:flex">
          <div className="relative flex flex-col justify-between h-screen p-8 text-white">
            <div className="flex flex-row justify-between px-8 py-6">
              <div>
                <img className={"expanded"} src={`/logos/kwe_logo_dark.png`} alt={""} />
              </div>
              <div>
                <select className="text-white bg-transparent hover:bg-transparent">
                  <option className="text-black">Language</option>
                  <option className="text-black">Korean</option>
                  <option className="text-black">English</option>
                  <option className="text-black">Japanese</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col p-8">
              <p className="mb-4 text-2xl font-bold">Welcome!</p>
              <p className="text-sm font-thin">
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
                egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet,
                ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
                Mauris placerat eleifend leo.
              </p>
            </div>
            <div className="z-10 flex flex-row items-center justify-between w-full p-8 text-xs">
              <div className="text-white">KREAM WEB</div>
              <div className="flex flex-row ml-auto space-x-2">
                <div>Contact us</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full h-screen bg-white place-content-center place-items-center">
          <div className="w-full xl:w-[460px] h-screen xl:h-[600px]">
            <div className="flex flex-row justify-between px-8 py-6 border-b border-gray-100 xl:hidden">
              <div>
                <img className={"expanded"} src={`/logos/kwe_logo_bright.png`} alt={""} />
              </div>
            </div>
            <div className="flex flex-col justify-center px-4 py-6 space-y-2">
              <span className="mt-4 ml-4 text-2xl font-extrabold">Welcome Back!</span>
              <span className="ml-4 text-sm">Please enter userid and password to login</span>
            </div>
            <div className="p-8">
              <Login />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
