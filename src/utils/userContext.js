// UserInfoContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { loadUser } from "../actions/userAction";
import store from "../store";
export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {user , isAuthenticated, loading } = useSelector((state) => state.user); // Assuming your Redux state has a "user" slice
  const [userInfo, setUserInfo] = useState({
    id:null,
    user: null,
    isAuthenticated: false,
    loading: true,
    name: null,
    role: null,
  })

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!user && !loading && !storedUserId) {
        try{
          await dispatch(loadUser());
        } catch (error) {
          console.log("Failed to load user:", error)
        }
      }
    };
    fetchUser();
  }, [user, loading, dispatch]);

  useEffect(() => {
   if (!loading) {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setUserInfo((prevState) => ({
      ...prevState,
      id: user?.id || storedUserId ? storedUserId : null, 
      name: user?.name || storedUserName ? storedUserName : null,
      role: user?.role || null,
      user: user,
      isAuthenticated,
      loading,
    }))
   }
    }, [user, isAuthenticated, loading]);

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  );
};
export const useUser = () => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserInfoProvider');
  }
  return context;
};