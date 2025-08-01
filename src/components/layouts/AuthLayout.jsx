import React from "react";
// import UI_IMG from "../../assets/images/bg-login.jpg";
import UI_IMG from "../../assets/images/task-5.avif";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-10">
        <h2 className="text-lg font-medium text-black">Assignado</h2>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] max-h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img src={UI_IMG} className="w-64 lg:w-[90%]" />
      </div>
    </div>
  );
};

export default AuthLayout;

// bg-[url('/task-4.avif')]
