import { jwtDecode } from "jwt-decode";
import { setAuthInfo, clearAuthInfo } from "../actions/authAction";
import { useDispatch } from "react-redux";

export const isTokenValid = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Expired Access Token: ", error);
    return false;
  }
};

export const getRolesFromToken = (data) => {
  try {
    const decodedToken = jwtDecode(data.accessToken);
    //roles 추출
    const roles = decodedToken.subject.memberType.map((role) => role.roleName);
    return roles;
  } catch (error) {
    console.error("Error decoding access token:", error);
    return [];
  }
};
