import { useSelector } from "react-redux";
import { selectGlobalLoading } from "../utils/selectGlobalLoading";
export const useGlobalLoading = () => {
    return useSelector(selectGlobalLoading);
}