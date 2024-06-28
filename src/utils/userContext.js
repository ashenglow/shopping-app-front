// UserInfoContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const user = useSelector((state) => state.user.user); // Assuming your Redux state has a "user" slice
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (user) {
      // Assuming you have these properties in the user object
      const { id, name, role } = user;
      setUserInfo({ id, name, role });
    } else {
      setUserInfo(null);
    }
  }, [user]);

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserInfoContext);
