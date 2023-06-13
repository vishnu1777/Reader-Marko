import React from "react";
import Marquee from "react-fast-marquee";
import UserProfile from "./UserProfile";
const NavBar = () => {
  return (
    <div className="h-20 max-w-7xl mx-auto flex items-center gap-5 md:gap-3 justify-between px-4 py-1">
      <img
        src="data:image/jpeg;base64,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"
        alt=""
        className="h-10 w-10 rounded-full"
      />
      <div className="text-xl flex-1">
        <Marquee style={{ color: "red" }}>
          Please download the demo excel sheets
        </Marquee>
      </div>

      <UserProfile />
    </div>
  );
};

export default NavBar;
